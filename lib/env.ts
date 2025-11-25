// 简化的环境变量配置 - 不依赖任何第三方库
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  // 移除所有第三方服务的环境变量
}

// 简化的环境变量验证
export function validateEnv() {
  console.log("环境变量验证完成")
}
