import { hashPassword } from "../lib/password"
import { db } from "../lib/db" // 假设您有一个数据库连接

async function migratePasswords() {
  console.log("开始密码迁移...")

  // 获取所有用户
  const users = await db.users.findMany()
  console.log(`找到 ${users.length} 个用户需要迁移`)

  let migratedCount = 0
  let errorCount = 0

  for (const user of users) {
    try {
      // 检查密码是否已经是哈希格式
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        console.log(`用户 ${user.username} 的密码已经是哈希格式，跳过`)
        continue
      }

      // 哈希密码
      const hashedPassword = await hashPassword(user.password)

      // 更新用户密码
      await db.users.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      })

      migratedCount++
      console.log(`成功迁移用户 ${user.username} 的密码`)
    } catch (error) {
      errorCount++
      console.error(`迁移用户 ${user.username} 的密码时出错:`, error)
    }
  }

  console.log(`密码迁移完成。成功: ${migratedCount}, 错误: ${errorCount}`)
}

// 执行迁移
migratePasswords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("密码迁移失败:", error)
    process.exit(1)
  })
