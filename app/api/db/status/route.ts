import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    return NextResponse.json({
      connected: isConnected,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("数据库状态检查失败:", error)

    return NextResponse.json(
      {
        connected: false,
        error: "数据库连接检查失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
