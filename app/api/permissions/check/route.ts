import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getRoleById, hasPermission } from "@/models/permission"

export async function GET(req: NextRequest) {
  try {
    // 获取权限代码
    const { searchParams } = new URL(req.url)
    const permissionCode = searchParams.get("code")

    if (!permissionCode) {
      return NextResponse.json({ success: false, message: "缺少权限代码" }, { status: 400 })
    }

    // 获取认证令牌
    const token = req.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, hasPermission: false, message: "未认证" }, { status: 401 })
    }

    // 验证令牌
    const payload = await verifyToken(token)

    // 获取用户角色
    const role = getRoleById(payload.role)

    if (!role) {
      return NextResponse.json({ success: false, hasPermission: false, message: "无效的角色" }, { status: 403 })
    }

    // 检查权限
    const permitted = hasPermission(role, permissionCode)

    return NextResponse.json({
      success: true,
      hasPermission: permitted,
    })
  } catch (error) {
    console.error("权限检查错误:", error)
    return NextResponse.json({ success: false, hasPermission: false, message: "认证失败" }, { status: 401 })
  }
}
