const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-production"

interface TokenPayload {
  id: string
  username: string
  role: string
  name: string
  iat?: number
  exp?: number
}

/**
 * Verify a JWT-like auth token and return its payload.
 * Uses a simple HMAC-based approach compatible with the server runtime.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    const [headerB64, payloadB64, signatureB64] = parts

    // Verify signature
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    )

    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = base64UrlDecode(signatureB64)

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data)

    if (!isValid) {
      throw new Error("Invalid token signature")
    }

    // Decode payload
    const payload: TokenPayload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadB64)),
    )

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create a signed token for a user payload.
 */
export async function createToken(payload: Omit<TokenPayload, "iat" | "exp">, expiresInSeconds = 86400): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  }

  const header = { alg: "HS256", typ: "JWT" }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload))

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const data = encoder.encode(`${headerB64}.${payloadB64}`)
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data)
  const signatureB64 = base64UrlEncodeBuffer(signatureBuffer)

  return `${headerB64}.${payloadB64}.${signatureB64}`
}

function base64UrlEncode(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  return base64UrlEncodeBuffer(bytes.buffer)
}

function base64UrlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (const b of bytes) {
    binary += String.fromCharCode(b)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
