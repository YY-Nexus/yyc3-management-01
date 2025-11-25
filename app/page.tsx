"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  Clock,
  BarChart2,
  UserCheck,
  GitMerge,
  FileCheck2,
  MessageSquare,
  Bot,
  Briefcase,
  Palette,
  PenTool as Tool,
  DollarSign,
  Package,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HonorsShowcase } from "@/components/honors-showcase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MobileNav } from "@/components/mobile-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useResponsive } from "@/hooks/use-responsive"

// 导航项组件
function NavItem({
  icon,
  label,
  href,
  isOpen,
}: { icon: React.ReactNode; label: string; href: string; isOpen: boolean }) {
  return (
    <Link href={href} className={`sidebar-item ${href === "/" ? "active" : ""}`}>
      {icon}
      {isOpen && <span className="ml-3">{label}</span>}
    </Link>
  )
}

// 仪表盘卡片组件
function DashboardCard({
  title,
  count,
  icon,
  description,
  color,
}: {
  title: string
  count: number
  icon: React.ReactNode
  description: string
  color: "blue" | "purple" | "indigo"
}) {
  const gradients = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
  }

  return (
    <Card className="hover-lift overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[color]} opacity-10 rounded-bl-full`}
      ></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{count}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <div className="p-3 rounded-lg bg-white shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// 项目项组件
function ProjectItem({
  name,
  status,
  progress,
  team,
}: {
  name: string
  status: string
  progress: number
  team: string[]
}) {
  const statusColors: Record<string, string> = {
    进行中: "bg-green-100 text-green-800",
    计划中: "bg-yellow-100 text-yellow-800",
    审核中: "bg-blue-100 text-blue-800",
    已完成: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="bg-white/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-slate-800">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>进度</span>
          <span>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-slate-100"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {team.map((member, index) => (
            <Avatar key={index} className="h-6 w-6 border-2 border-white">
              <AvatarFallback className="text-[10px]">{member[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-slate-500 ml-2">{team.length} 名成员</span>
      </div>
    </div>
  )
}

// 用户图标组件
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// 骨架屏组件
function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏骨架屏 */}
      <aside className="w-64 bg-slate-800 h-full flex-shrink-0 hidden md:block">
        <div className="p-4">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="px-4 py-2">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-4 w-24 mb-3" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`nav1-${i}`} className="h-10 w-full mb-2" />
            ))}
          <Skeleton className="h-4 w-24 my-3" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`nav2-${i}`} className="h-10 w-full mb-2" />
            ))}
        </div>
      </aside>

      {/* 主要内容区域骨架屏 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 mr-4 rounded-md" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={`card-${i}`} className="h-32 w-full rounded-lg" />
                ))}
            </div>

            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg mb-8" />

            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  )
}

// 主组件
export default function SmartOfficeSystem() {
  const [progress, setProgress] = useState(13)
  const { user, isLoading, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { isMobile, isTablet, screenSize } = useResponsive()

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // 如果认证状态正在加载,显示骨架屏
  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏背景 */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen && isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 侧边栏 */}
      <aside
        className={`fixed lg:relative z-30 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        } w-64 lg:w-64 flex-shrink-0`}
      >
        <div
          className="h-full flex flex-col bg-slate-800 overflow-y-auto"
          style={{ backgroundImage: "url(/images/sidebar-bg.png)", backgroundSize: "cover" }}
        >
          <div className="p-4 flex items-center justify-between">
            <img
              src="/images/yanyu-logo.png"
              alt="言语云"
              className={`transition-all duration-300 my-0 py-0 px-5 mx-10 ${isSidebarOpen ? "w-32 h-20" : "w-12 h-12"}`}
            />
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="text-white lg:hidden">
                <X size={24} />
              </button>
            )}
          </div>

          <div className="mt-2 px-3">
            {isSidebarOpen && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="搜索..."
                  className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex-1 py-2">
            <div className="px-3 py-2">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">主要功能</p>
              )}
              <nav className="space-y-1">
                <NavItem icon={<Home size={20} />} label="首页" href="/" isOpen={isSidebarOpen} />
                <NavItem icon={<BarChart2 size={20} />} label="数据仪表盘" href="/dashboard" isOpen={isSidebarOpen} />
                <NavItem icon={<FileText size={20} />} label="文档管理" href="/documents" isOpen={isSidebarOpen} />
                <NavItem icon={<Calendar size={20} />} label="日程安排" href="/calendar" isOpen={isSidebarOpen} />
                <NavItem icon={<Users size={20} />} label="员工管理" href="/employee" isOpen={isSidebarOpen} />
                <NavItem icon={<GitMerge size={20} />} label="组织架构" href="/organization" isOpen={isSidebarOpen} />
              </nav>
            </div>

            <div className="px-3 py-2">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">业务功能</p>
              )}
              <nav className="space-y-1">
                <NavItem
                  icon={<Briefcase size={20} />}
                  label="岗位设置"
                  href="/position-settings"
                  isOpen={isSidebarOpen}
                />
                <NavItem icon={<FileCheck2 size={20} />} label="OA审批" href="/approval" isOpen={isSidebarOpen} />
                <NavItem icon={<Clock size={20} />} label="时间节点" href="/timeline" isOpen={isSidebarOpen} />
                <NavItem icon={<BarChart2 size={20} />} label="落地情况" href="/progress" isOpen={isSidebarOpen} />
                <NavItem
                  icon={<UserCheck size={20} />}
                  label="客户回访"
                  href="/customer-followup"
                  isOpen={isSidebarOpen}
                />
              </nav>
            </div>

            <div className="px-3 py-2">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">智能工具</p>
              )}
              <nav className="space-y-1">
                <NavItem icon={<Palette size={20} />} label="推广设计" href="/design-tools" isOpen={isSidebarOpen} />
                <NavItem
                  icon={<MessageSquare size={20} />}
                  label="信息中心"
                  href="/message-center"
                  isOpen={isSidebarOpen}
                />
                <NavItem icon={<Bot size={20} />} label="AI助理" href="/ai-assistant" isOpen={isSidebarOpen} />
                <NavItem icon={<Tool size={20} />} label="AI机维" href="/ai-maintenance" isOpen={isSidebarOpen} />
              </nav>
            </div>

            <div className="px-3 py-2">
              {isSidebarOpen && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">管理功能</p>
              )}
              <nav className="space-y-1">
                <NavItem icon={<DollarSign size={20} />} label="收银管理" href="/cashier" isOpen={isSidebarOpen} />
                <NavItem icon={<Package size={20} />} label="仓库管理" href="/inventory" isOpen={isSidebarOpen} />
                <NavItem icon={<Settings size={20} />} label="系统设置" href="/settings" isOpen={isSidebarOpen} />
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700">
            {isSidebarOpen ? (
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || "用户"}</p>
                  <p className="text-xs text-slate-400">{user?.role === "admin" ? "管理员" : "普通用户"}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto text-slate-400 hover:text-white">
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User size={16} className="mr-2" />
                      个人资料
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings size={16} className="mr-2" />
                      账户设置
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      <LogOut size={16} className="mr-2" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full text-slate-400 hover:text-white"
                onClick={logout}
              >
                <LogOut size={20} />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* 主要内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              {isMobile ? (
                <MobileNav />
              ) : (
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </Button>
              )}
              <h2 className="text-xl font-semibold text-slate-800">仪表盘</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User size={16} className="mr-2" />
                    个人资料
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    账户设置
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut size={16} className="mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div
          className="flex-1 overflow-auto p-6 bg-slate-50 pb-20 md:pb-6"
          style={{
            backgroundImage: "url(/images/bg-pattern-1.png)",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">欢迎回来,{user?.name || "用户"}</h1>
              <p className="text-slate-600">今天是个美好的工作日,让我们开始吧!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="待办任务"
                count={5}
                icon={<Clock className="w-8 h-8 text-blue-500" />}
                description="今日需要完成的任务"
                color="blue"
              />
              <DashboardCard
                title="今日会议"
                count={2}
                icon={<Users className="w-8 h-8 text-purple-500" />}
                description="已安排的会议"
                color="purple"
              />
              <DashboardCard
                title="未读消息"
                count={3}
                icon={<MessageSquare className="w-8 h-8 text-indigo-500" />}
                description="需要查看的新消息"
                color="indigo"
              />
            </div>

            <Tabs defaultValue="tasks" className="mb-8">
              <TabsList className="bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  任务进度
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  项目概览
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>本周任务完成进度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Progress
                        value={progress}
                        className="w-full h-3 bg-blue-100"
                        indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white/50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-slate-500">已完成</div>
                        <div className="text-2xl font-bold text-slate-800">8</div>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-slate-500">进行中</div>
                        <div className="text-2xl font-bold text-slate-800">4</div>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-slate-500">待处理</div>
                        <div className="text-2xl font-bold text-slate-800">3</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="projects">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>进行中的项目</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ProjectItem
                        name="智能办公系统升级"
                        status="进行中"
                        progress={75}
                        team={["张三", "李四", "王五"]}
                      />
                      <ProjectItem name="客户管理系统优化" status="计划中" progress={25} team={["赵六", "钱七"]} />
                      <ProjectItem name="年度财务报告" status="审核中" progress={90} team={["孙八", "周九", "吴十"]} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <HonorsShowcase />
          </div>
        </div>

        {/* 页脚 */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center hidden md:block">
          <div className="flex justify-center items-center mb-2">
            <img src="/images/yanyu-logo.png" alt="言语云" className="w-16 h-10" />
          </div>
          <p className="text-sm text-gray-500">© 2025 言语(河南)智能科技有限公司. 保留所有权利.</p>
        </footer>
      </main>

      {/* 移动端底部导航 */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}
