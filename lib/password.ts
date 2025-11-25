import * as bcrypt from "bcryptjs"

// 哈希密码
export async function hashPassword(password: string): Promise<string> {
  // 使用10轮盐值生成，这是一个安全和性能的平衡点
  return bcrypt.hash(password, 10)
}

// 验证密码
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// 生成安全的随机密码
export function generateSecurePassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-="
  let password = ""

  // 确保密码包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符
  password += charset.match(/[A-Z]/)[0]
  password += charset.match(/[a-z]/)[0]
  password += charset.match(/[0-9]/)[0]
  password += charset.match(/[^A-Za-z0-9]/)[0]

  // 填充剩余长度
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  // 打乱密码字符顺序
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("")
}
