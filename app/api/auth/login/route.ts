import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("登录尝试:", body.username)

    // 简化的登录逻辑 - 不进行实际认证
    return NextResponse.json(
      {
        success: false,
        message: "系统已简化，登录功能已禁用",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("登录错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
