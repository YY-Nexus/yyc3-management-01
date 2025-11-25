import { NextResponse } from "next/server"
import { generateCsrfToken } from "@/lib/csrf"

export async function GET() {
  try {
    // 生成新的CSRF令牌
    const csrfToken = generateCsrfToken()

    return NextResponse.json({
      success: true,
      csrfToken,
    })
  } catch (error) {
    console.error("CSRF令牌生成错误:", error)

    // 确保返回有效的JSON响应
    return NextResponse.json(
      {
        success: false,
        message: "服务器错误",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
