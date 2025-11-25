import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 简化的中间件 - 移除所有第三方依赖
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname

  // 简化的路径处理 - 允许访问所有页面
  console.log("访问路径:", path)

  return NextResponse.next()
}

// 配置匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了静态文件
     */
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
}
