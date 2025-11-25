"use client"

import { useState, useEffect } from "react"

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/auth/csrf-token")

        // 检查响应是否成功
        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
        }

        // 检查响应是否为JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}`)
        }

        const data = await response.json()

        if (data.success && data.csrfToken) {
          setCsrfToken(data.csrfToken)
        } else {
          setError(data.message || "获取CSRF令牌失败")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "获取CSRF令牌时出错"
        setError(errorMessage)
        console.error("CSRF令牌获取错误:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCsrfToken()
  }, [])

  // 提供重新获取令牌的方法
  const refetchToken = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/csrf-token")

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("服务器返回非JSON响应")
      }

      const data = await response.json()

      if (data.success && data.csrfToken) {
        setCsrfToken(data.csrfToken)
      } else {
        setError(data.message || "获取CSRF令牌失败")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "重新获取CSRF令牌时出错"
      setError(errorMessage)
      console.error("CSRF令牌重新获取错误:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return { csrfToken, isLoading, error, refetchToken }
}
