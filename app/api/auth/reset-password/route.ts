import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/password"
import { validateInput } from "@/lib/validations"
import { validateCsrfToken } from "@/lib/csrf"
import { db } from "@/lib/db" // 假设您有一个数据库连接
import { z } from "zod"

// 密码重置验证模式
const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, "密码至少需要8个字符")
    .max(100, "密码不能超过100个字符")
    .regex(/[A-Z]/, "密码必须包含至少一个大写字母")
    .regex(/[a-z]/, "密码必须包含至少一个小写字母")
    .regex(/[0-9]/, "密码必须包含至少一个数字")
    .regex(/[^A-Za-z0-9]/, "密码必须包含至少一个特殊字符"),
  csrfToken: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 验证CSRF令牌
    if (!validateCsrfToken(body.csrfToken)) {
      return NextResponse.json({ success: false, message: "无效的请求" }, { status: 403 })
    }

    // 验证输入数据
    const validationResult = await validateInput(resetPasswordSchema, body)
    if (!validationResult.success) {
      const errors = validationResult.errors?.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return NextResponse.json({ success: false, message: `输入验证失败: ${errors}` }, { status: 400 })
    }

    const { token, newPassword } = validationResult.data

    // 验证重置令牌
    const passwordReset = await db.passwordResets.findUnique({
      where: { token, expiresAt: { gt: new Date() } },
    })

    if (!passwordReset) {
      return NextResponse.json({ success: false, message: "无效或已过期的重置令牌" }, { status: 400 })
    }

    // 哈希新密码
    const hashedPassword = await hashPassword(newPassword)

    // 更新用户密码
    await db.users.update({
      where: { id: passwordReset.userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    // 删除已使用的重置令牌
    await db.passwordResets.delete({
      where: { id: passwordReset.id },
    })

    return NextResponse.json({
      success: true,
      message: "密码已成功重置",
    })
  } catch (error) {
    console.error("密码重置错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
