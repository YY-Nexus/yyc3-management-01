"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, TrendingUp, Users, DollarSign, Package, Clock, Play, Pause, Download } from "lucide-react"
import * as XLSX from "xlsx"

interface RealTimeData {
  time: string
  value: number
  users: number
  revenue: number
  orders: number
}

export function RealTimeDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [data, setData] = useState<RealTimeData[]>([])
  const [currentMetric, setCurrentMetric] = useState<"value" | "users" | "revenue" | "orders">("value")
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")

  // 生成模拟实时数据
  const generateData = (): RealTimeData => {
    const now = new Date()
    return {
      time: now.toLocaleTimeString(),
      value: Math.floor(Math.random() * 100) + 50,
      users: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 30) + 10,
    }
  }

  // 实时更新数据
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData, generateData()]
        // 保留最近20个数据点
        return newData.slice(-20)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // 初始化数据
  useEffect(() => {
    const initialData = Array.from({ length: 10 }, () => generateData())
    setData(initialData)
  }, [])

  // 导出数据为Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "实时数据")
    XLSX.writeFile(wb, `实时数据_${new Date().toLocaleDateString()}.xlsx`)
  }

  // 渲染图表
  const renderChart = () => {
    const dataKey = currentMetric

    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        )
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey={dataKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        )
    }
  }

  const metrics = [
    { key: "value" as const, label: "数据值", icon: Activity, color: "blue" },
    { key: "users" as const, label: "用户数", icon: Users, color: "purple" },
    { key: "revenue" as const, label: "收入", icon: DollarSign, color: "green" },
    { key: "orders" as const, label: "订单", icon: Package, color: "orange" },
  ]

  const latestData = data[data.length - 1] || { value: 0, users: 0, revenue: 0, orders: 0 }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant={isLive ? "default" : "outline"} onClick={() => setIsLive(!isLive)} className="gap-2">
            {isLive ? (
              <>
                <Pause size={16} />
                暂停更新
              </>
            ) : (
              <>
                <Play size={16} />
                开始更新
              </>
            )}
          </Button>
          <Badge variant={isLive ? "default" : "secondary"} className="gap-1">
            <Clock size={12} />
            {isLive ? "实时更新中" : "已暂停"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToExcel} className="gap-2 bg-transparent">
            <Download size={16} />
            导出数据
          </Button>
        </div>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const value = latestData[metric.key]
          return (
            <Card
              key={metric.key}
              className={`cursor-pointer transition-all ${
                currentMetric === metric.key ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => setCurrentMetric(metric.key)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {metric.key === "revenue" ? `¥${value.toLocaleString()}` : value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                    <Icon className={`text-${metric.color}-600`} size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 图表类型切换 */}
      <div className="flex gap-2">
        <Button variant={chartType === "line" ? "default" : "outline"} onClick={() => setChartType("line")} size="sm">
          折线图
        </Button>
        <Button variant={chartType === "area" ? "default" : "outline"} onClick={() => setChartType("area")} size="sm">
          面积图
        </Button>
        <Button variant={chartType === "bar" ? "default" : "outline"} onClick={() => setChartType("bar")} size="sm">
          柱状图
        </Button>
      </div>

      {/* 实时图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            实时数据趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
