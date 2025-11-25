"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Home, FileText, Users, Calendar, Settings, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo-component"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigationItems = [
  { icon: Home, label: "首页", href: "/" },
  { icon: FileText, label: "文档管理", href: "/documents" },
  { icon: Calendar, label: "日程安排", href: "/calendar" },
  { icon: Users, label: "员工管理", href: "/employee" },
  { icon: Settings, label: "系统设置", href: "/settings" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const pathname = usePathname()

  // 手势滑动检测
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isRightSwipe && !open) {
      setOpen(true)
    } else if (isLeftSwipe && open) {
      setOpen(false)
    }
  }

  // 阻止页面滚动当侧边栏打开时
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <>
      {/* 手势检测区域 */}
      <div
        className="fixed left-0 top-0 w-4 h-full z-40 md:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden relative">
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="pr-0 sm:max-w-xs w-80 bg-gradient-to-b from-slate-800 to-slate-900"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col h-full">
            {/* 头部 */}
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
              <Logo variant="mobile" width={120} height={40} showText={true} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-white hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">关闭菜单</span>
              </Button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 overflow-auto py-4">
              <div className="space-y-2 px-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200",
                        "hover:bg-slate-700/50 active:bg-slate-600/50 active:scale-95",
                        isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:text-white",
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* 底部信息 */}
            <div className="border-t border-slate-700 p-4">
              <div className="text-center text-slate-400 text-sm">
                <p>言语云智能办公系统</p>
                <p className="text-xs mt-1">v1.0.0</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
