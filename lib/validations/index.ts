import { z } from "zod"

// 导出所有验证模式
export * from "./auth"
export * from "./user"
export * from "./customer"
export * from "./task"

// 通用验证函数
export async function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: any,
): Promise<{ success: boolean; data?: T; errors?: z.ZodError }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// 格式化验证错误
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {}

  errors.errors.forEach((err) => {
    const path = err.path.join(".")
    formattedErrors[path] = err.message
  })

  return formattedErrors
}
