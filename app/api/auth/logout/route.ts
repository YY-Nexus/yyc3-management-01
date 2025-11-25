import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("登出请求")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("登出错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
