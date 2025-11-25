import { randomBytes, createHmac } from "crypto"

// CSRF令牌密钥（在生产环境中应该从环境变量获取）
const CSRF_SECRET = process.env.CSRF_SECRET || "default-csrf-secret-key-change-in-production"

// 生成CSRF令牌
export function generateCsrfToken(): string {
  try {
    // 生成随机字节
    const randomData = randomBytes(32).toString("hex")

    // 创建时间戳
    const timestamp = Date.now().toString()

    // 组合数据
    const data = `${randomData}.${timestamp}`

    // 创建HMAC签名
    const signature = createHmac("sha256", CSRF_SECRET).update(data).digest("hex")

    // 返回完整的令牌
    return `${data}.${signature}`
  } catch (error) {
    console.error("生成CSRF令牌时出错:", error)
    throw new Error("无法生成CSRF令牌")
  }
}

// 验证CSRF令牌
export function validateCsrfToken(token: string): boolean {
  try {
    if (!token || typeof token !== "string") {
      return false
    }

    // 分割令牌
    const parts = token.split(".")
    if (parts.length !== 3) {
      return false
    }

    const [randomData, timestamp, signature] = parts

    // 重新创建数据
    const data = `${randomData}.${timestamp}`

    // 验证签名
    const expectedSignature = createHmac("sha256", CSRF_SECRET).update(data).digest("hex")

    if (signature !== expectedSignature) {
      return false
    }

    // 检查令牌是否过期（24小时）
    const tokenTime = Number.parseInt(timestamp, 10)
    const currentTime = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24小时

    if (currentTime - tokenTime > maxAge) {
      return false
    }

    return true
  } catch (error) {
    console.error("验证CSRF令牌时出错:", error)
    return false
  }
}

// 从请求中提取CSRF令牌
export function extractCsrfToken(request: Request): string | null {
  try {
    // 首先尝试从请求头获取
    const headerToken = request.headers.get("x-csrf-token")
    if (headerToken) {
      return headerToken
    }

    // 如果是POST请求，尝试从表单数据获取
    if (request.method === "POST") {
      // 注意：这里需要克隆请求，因为body只能读取一次
      // 在实际使用中，应该在中间件中处理这个逻辑
      return null
    }

    return null
  } catch (error) {
    console.error("提取CSRF令牌时出错:", error)
    return null
  }
}
