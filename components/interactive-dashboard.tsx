"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Download, Filter, Maximize2 } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export function InteractiveDashboard() {
  const [timeRange, setTimeRange] = useState("week")
  const [department, setDepartment] = useState("all")
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "pie" | "scatter" | "radar">("line")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 模拟数据
  const trendData = [
    { name: "周一", sales: 4000, users: 2400, revenue: 2400 },
    { name: "周二", sales: 3000, users: 1398, revenue: 2210 },
    { name: "周三", sales: 2000, users: 9800, revenue: 2290 },
    { name: "周四", sales: 2780, users: 3908, revenue: 2000 },
    { name: "周五", sales: 1890, users: 4800, revenue: 2181 },
    { name: "周六", sales: 2390, users: 3800, revenue: 2500 },
    { name: "周日", sales: 3490, users: 4300, revenue: 2100 },
  ]

  const distributionData = [
    { name: "产品A", value: 400 },
    { name: "产品B", value: 300 },
    { name: "产品C", value: 300 },
    { name: "产品D", value: 200 },
  ]

  const comparisonData = [
    { subject: "销售", A: 120, B: 110, fullMark: 150 },
    { subject: "营销", A: 98, B: 130, fullMark: 150 },
    { subject: "客服", A: 86, B: 130, fullMark: 150 },
    { subject: "研发", A: 99, B: 100, fullMark: 150 },
    { subject: "运营", A: 85, B: 90, fullMark: 150 },
  ]

  const correlationData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ]

  // 导出为Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()

    const trendWs = XLSX.utils.json_to_sheet(trendData)
    XLSX.utils.book_append_sheet(wb, trendWs, "趋势数据")

    const distWs = XLSX.utils.json_to_sheet(distributionData)
    XLSX.utils.book_append_sheet(wb, distWs, "分布数据")

    XLSX.writeFile(wb, `数据报告_${new Date().toLocaleDateString()}.xlsx`)
  }

  // 导出为PDF
  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("数据分析报告", 20, 20)

    doc.setFontSize(12)
    doc.text(`生成时间: ${new Date().toLocaleString()}`, 20, 30)
    doc.text(`时间范围: ${timeRange}`, 20, 40)
    doc.text(`部门: ${department}`, 20, 50)

    doc.save(`数据报告_${new Date().toLocaleDateString()}.pdf`)
  }

  // 渲染主图表
  const renderMainChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
          </LineChart>
        )
      case "bar":
        return (
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="users" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        )
      case "area":
        return (
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            />
            <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        )
      case "pie":
        return (
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="指标X" />
            <YAxis type="number" dataKey="y" name="指标Y" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="数据点" data={correlationData} fill="#3b82f6" />
          </ScatterChart>
        )
      case "radar":
        return (
          <RadarChart data={comparisonData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="部门A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Radar name="部门B" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        )
    }
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : ""}`}>
      {/* 控制栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">今日</SelectItem>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="sales">销售部</SelectItem>
              <SelectItem value="market">市场部</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline" className="gap-1">
            <Filter size={12} />
            2个筛选条件
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToExcel} className="gap-1 bg-transparent">
            <Download size={16} />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-1 bg-transparent">
            <Download size={16} />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="gap-1">
            <Maximize2 size={16} />
            {isFullscreen ? "退出" : "全屏"}
          </Button>
        </div>
      </div>

      {/* 图表类型切换 */}
      <div className="flex flex-wrap gap-2">
        <Button variant={chartType === "line" ? "default" : "outline"} size="sm" onClick={() => setChartType("line")}>
          折线图
        </Button>
        <Button variant={chartType === "bar" ? "default" : "outline"} size="sm" onClick={() => setChartType("bar")}>
          柱状图
        </Button>
        <Button variant={chartType === "area" ? "default" : "outline"} size="sm" onClick={() => setChartType("area")}>
          面积图
        </Button>
        <Button variant={chartType === "pie" ? "default" : "outline"} size="sm" onClick={() => setChartType("pie")}>
          饼图
        </Button>
        <Button
          variant={chartType === "scatter" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("scatter")}
        >
          散点图
        </Button>
        <Button variant={chartType === "radar" ? "default" : "outline"} size="sm" onClick={() => setChartType("radar")}>
          雷达图
        </Button>
      </div>

      {/* 主图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            数据趋势分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {renderMainChart()}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 多维度分析标签页 */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList>
          <TabsTrigger value="comparison">对比分析</TabsTrigger>
          <TabsTrigger value="distribution">分布分析</TabsTrigger>
          <TabsTrigger value="correlation">关联分析</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>部门对比分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={comparisonData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="部门A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="部门B" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>产品分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation">
          <Card>
            <CardHeader>
              <CardTitle>数据关联性分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="指标X" />
                  <YAxis type="number" dataKey="y" name="指标Y" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="数据点" data={correlationData} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
