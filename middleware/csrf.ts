import { type NextRequest, NextResponse } from "next/server"
import { validateCsrfToken } from "@/lib/csrf"

// 需要CSRF保护的方法
const CSRF_METHODS = ["POST", "PUT", "DELETE", "PATCH"]

// 不需要CSRF保护的路径
const CSRF_EXEMPT_PATHS = [
  "/api/auth/csrf-token", // 获取CSRF令牌的API
  "/api/auth/status", // 状态检查API
  "/api/db/status", // 数据库状态API
]

export function csrfMiddleware(req: NextRequest) {
  const { method, nextUrl } = req
  const { pathname } = nextUrl

  // 检查是否需要CSRF保护
  if (CSRF_METHODS.includes(method) && !CSRF_EXEMPT_PATHS.some((path) => pathname.startsWith(path))) {
    try {
      // 从请求头获取CSRF令牌
      const csrfToken = req.headers.get("x-csrf-token")

      // 验证CSRF令牌
      if (!csrfToken || !validateCsrfToken(csrfToken)) {
        return NextResponse.json(
          {
            success: false,
            message: "CSRF验证失败",
            error: "无效或缺失的CSRF令牌",
          },
          { status: 403 },
        )
      }
    } catch (error) {
      console.error("CSRF验证错误:", error)
      return NextResponse.json(
        {
          success: false,
          message: "CSRF验证错误",
          error: error instanceof Error ? error.message : "未知错误",
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.next()
}
