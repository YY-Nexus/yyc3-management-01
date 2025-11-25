import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/password"
import { validateInput, registerSchema } from "@/lib/validations"
import { validateCsrfToken } from "@/lib/csrf"
import { db } from "@/lib/db" // 假设您有一个数据库连接

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 验证CSRF令牌
    if (!validateCsrfToken(body.csrfToken)) {
      return NextResponse.json({ success: false, message: "无效的请求" }, { status: 403 })
    }

    // 验证输入数据
    const validationResult = await validateInput(registerSchema, body)
    if (!validationResult.success) {
      const errors = validationResult.errors?.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return NextResponse.json({ success: false, message: `输入验证失败: ${errors}` }, { status: 400 })
    }

    const { username, password, email, name } = validationResult.data

    // 检查用户名是否已存在
    const existingUser = await db.users.findUnique({ where: { username } })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "用户名已存在" }, { status: 409 })
    }

    // 检查邮箱是否已存在
    const existingEmail = await db.users.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ success: false, message: "邮箱已被使用" }, { status: 409 })
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password)

    // 创建新用户
    const newUser = await db.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
        name,
        role: "user", // 默认角色
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // 返回成功响应（不包含密码）
    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("注册错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
