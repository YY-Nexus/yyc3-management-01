"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("系统已简化，所有第三方集成已移除，登录功能已禁用")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("系统已简化，登录功能已禁用")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">智能办公系统</CardTitle>
        <CardDescription>系统已简化版本</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名（已禁用）"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（已禁用）"
              disabled
            />
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>系统简化</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button className="w-full" type="submit" disabled>
            登录（已禁用）
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>系统说明</AlertTitle>
            <AlertDescription>
              所有第三方集成和依赖已被移除，系统现在是纯原生实现。如需恢复功能，请重新配置相关服务。
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
