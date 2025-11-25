import { NextResponse } from "next/server"
import { env, validateEnv } from "@/lib/env"

export async function GET() {
  // 验证环境变量
  validateEnv()

  // 返回环境变量状态（不返回实际值，只返回是否设置）
  return NextResponse.json({
    success: true,
    environment: env.NODE_ENV,
    jwt_secret_set: env.JWT_SECRET !== "fallback-secret-key-for-development-only",
    message: "环境变量验证成功",
  })
}
