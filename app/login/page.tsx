"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import RegisterForm from "@/components/register-form"
import ForgotPasswordForm from "@/components/forgot-password-form"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { loginSchema } from "@/lib/validations"
import { Logo } from "@/components/logo-component"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, isLoading: authLoading, csrfToken } = useAuth()
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [generatedCaptcha, setGeneratedCaptcha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 生成验证码
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setGeneratedCaptcha(result)
  }

  // 初始化时生成验证码
  useEffect(() => {
    generateCaptcha()
  }, [])

  // 如果已认证，重定向到首页或来源页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = searchParams.get("from") || "/"
      router.push(from)
    }
  }, [isAuthenticated, router, searchParams])

  // 验证输入
  const validateInputs = () => {
    try {
      loginSchema.parse({
        username,
        password,
        captcha,
        generatedCaptcha,
        csrfToken,
      })
      setValidationErrors({})
      return true
    } catch (error: any) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err: any) => {
        const field = err.path[0]
        errors[field] = err.message
      })
      setValidationErrors(errors)
      return false
    }
  }

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 验证输入
    if (!validateInputs()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await login(username, password, captcha, generatedCaptcha)

      if (result.success) {
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        })
      } else {
        setError(result.message || "登录失败")
        generateCaptcha() // 刷新验证码
      }
    } catch (error) {
      setError("服务器错误，请稍后再试")
      generateCaptcha() // 刷新验证码
    } finally {
      setIsLoading(false)
    }
  }

  // 如果认证状态正在加载，显示加载状态
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen animated-gradient-bg">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col items-center">
            <Logo variant="default" showText={false} responsive={true} />
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
            <p className="text-white mt-4 text-center">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden animated-gradient-bg">
      {/* 装饰元素 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* 内容区 */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <Logo variant="default" responsive={true} />
        </div>

        <Card className="w-full max-w-md glass-card animate-slide-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center gradient-text">用户登录</CardTitle>
            <CardDescription className="text-center">请输入您的账号和密码</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${validationErrors.username ? "border-red-500" : ""} bg-white/50`}
                  />
                  {validationErrors.username && <p className="text-sm text-red-500">{validationErrors.username}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${validationErrors.password ? "border-red-500" : ""} bg-white/50`}
                  />
                  {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="captcha">验证码</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="captcha"
                      placeholder="请输入验证码"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      className={`${validationErrors.captcha ? "border-red-500" : ""} bg-white/50`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-32 h-10 flex items-center justify-center font-mono bg-white/50"
                      onClick={generateCaptcha}
                    >
                      {generatedCaptcha}
                      <RefreshCw className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  {validationErrors.captcha && <p className="text-sm text-red-500">{validationErrors.captcha}</p>}
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full mt-6 btn-gradient" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="link" className="text-blue-600" onClick={() => setShowForgotPassword(true)}>
              忘记密码？
            </Button>
            <Button variant="link" className="text-blue-600" onClick={() => setShowRegister(true)}>
              注册新账号
            </Button>
          </CardFooter>
        </Card>

        <footer className="mt-8 text-center text-sm text-blue-100 space-y-2 animate-fade-in">
          <div className="mb-4">
            <Logo variant="footer" width={80} height={50} showText={false} responsive={true} />
          </div>
          <p>
            <Link
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              ICP备案主体信息：yyhnit.com
            </Link>
          </p>
          <p>
            <Link
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              ICP备案/许可证号:豫ICP备2025106952号-1
            </Link>
          </p>
          <p>主办单位名称:言语(河南)智能科技有限公司</p>
          <p>
            <Link
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              ICP备案/许可证号:豫ICP备2025106952号
            </Link>
          </p>
          <p>
            <Link
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41030502001022"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              豫公网安备41030502001022号
            </Link>
          </p>
          <p>
            <Link
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41030502001024"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              豫公网安备41030502001024号
            </Link>
          </p>
        </footer>
      </div>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="gradient-text">注册新账号</DialogTitle>
            <DialogDescription>请填写以下信息以创建新账号</DialogDescription>
          </DialogHeader>
          <RegisterForm onSuccess={() => setShowRegister(false)} csrfToken={csrfToken} />
        </DialogContent>
      </Dialog>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="gradient-text">忘记密码</DialogTitle>
            <DialogDescription>请按照以下步骤重置您的密码</DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm onSuccess={() => setShowForgotPassword(false)} csrfToken={csrfToken} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
