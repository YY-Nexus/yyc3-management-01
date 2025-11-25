"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useApiClient } from "@/lib/api-client"

export function usePermission(permissionCode: string) {
  const { user } = useAuth()
  const api = useApiClient()
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkPermission() {
      if (!user) {
        setHasPermission(false)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get(`/api/permissions/check?code=${permissionCode}`)
        setHasPermission(response.hasPermission)
      } catch (err: any) {
        setError(err.message || "检查权限失败")
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermission()
  }, [user, permissionCode, api])

  return { hasPermission, isLoading, error }
}
