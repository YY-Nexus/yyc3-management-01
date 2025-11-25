"use client"

import { useState, useEffect } from "react"
import { Database, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DbStatusMonitorProps {
  className?: string
  pollingInterval?: number // 毫秒
  showLabel?: boolean
  onStatusChange?: (isConnected: boolean) => void
}

export function DbStatusMonitor({
  className,
  pollingInterval = 30000, // 默认30秒检查一次
  showLabel = true,
  onStatusChange,
}: DbStatusMonitorProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    if (isChecking) return

    setIsChecking(true)
    try {
      const response = await fetch("/api/db/status")
      const data = await response.json()

      const newStatus = data.connected
      if (isConnected !== newStatus) {
        setIsConnected(newStatus)
        if (onStatusChange) {
          onStatusChange(newStatus)
        }
      } else {
        setIsConnected(newStatus)
      }

      setLastChecked(new Date())
    } catch (error) {
      console.error("数据库状态检查失败:", error)
      setIsConnected(false)
      if (onStatusChange && isConnected !== false) {
        onStatusChange(false)
      }
    } finally {
      setIsChecking(false)
    }
  }

  // 初始检查和定期检查
  useEffect(() => {
    checkConnection()

    const interval = setInterval(checkConnection, pollingInterval)
    return () => clearInterval(interval)
  }, [pollingInterval])

  // 格式化上次检查时间
  const formatLastChecked = () => {
    if (!lastChecked) return "未检查"

    const now = new Date()
    const diff = now.getTime() - lastChecked.getTime()

    if (diff < 60000) {
      return "刚刚"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else {
      return lastChecked.toLocaleTimeString()
    }
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm",
        isConnected === true
          ? "bg-green-100 text-green-800"
          : isConnected === false
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800",
        className,
      )}
    >
      <Database size={16} className={isChecking ? "animate-pulse" : ""} />

      {isConnected === true && <CheckCircle2 size={16} className="text-green-600" />}
      {isConnected === false && <AlertCircle size={16} className="text-red-600" />}

      {showLabel && (
        <div className="flex flex-col">
          <span className="font-medium">
            {isConnected === true ? "数据库已连接" : isConnected === false ? "数据库连接失败" : "检查数据库..."}
          </span>
          <span className="text-xs opacity-70">上次检查: {formatLastChecked()}</span>
        </div>
      )}
    </div>
  )
}
