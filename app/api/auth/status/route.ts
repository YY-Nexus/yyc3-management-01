import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 简化的认证状态检查 - 始终返回未认证状态
    return NextResponse.json(
      {
        success: false,
        message: "系统已简化，无认证功能",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("状态检查错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
