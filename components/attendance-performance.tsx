"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, TrendingUp, Award } from "lucide-react"
import { format } from "date-fns"

interface AttendanceRecord {
  id: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  workHours: number
  status: "normal" | "late" | "early" | "absent"
}

interface PerformanceRecord {
  id: string
  employeeName: string
  month: string
  tasksCompleted: number
  salesTarget: number
  salesAchieved: number
  rating: number
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "张三",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "18:00",
    workHours: 8,
    status: "normal",
  },
  {
    id: "2",
    employeeName: "李四",
    date: "2024-01-15",
    checkIn: "09:15",
    checkOut: "18:30",
    workHours: 8.25,
    status: "late",
  },
  {
    id: "3",
    employeeName: "王五",
    date: "2024-01-15",
    checkIn: "08:45",
    checkOut: "17:45",
    workHours: 8,
    status: "early",
  },
]

const mockPerformance: PerformanceRecord[] = [
  {
    id: "1",
    employeeName: "张三",
    month: "2024-01",
    tasksCompleted: 25,
    salesTarget: 100000,
    salesAchieved: 120000,
    rating: 4.5,
  },
  {
    id: "2",
    employeeName: "李四",
    month: "2024-01",
    tasksCompleted: 22,
    salesTarget: 80000,
    salesAchieved: 75000,
    rating: 3.8,
  },
  {
    id: "3",
    employeeName: "王五",
    month: "2024-01",
    tasksCompleted: 28,
    salesTarget: 90000,
    salesAchieved: 95000,
    rating: 4.2,
  },
]

export default function AttendancePerformance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance)
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(mockPerformance)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<"attendance" | "performance">("attendance")

  const getStatusColor = (status: string) => {
    const colors = {
      normal: "bg-green-100 text-green-800",
      late: "bg-red-100 text-red-800",
      early: "bg-yellow-100 text-yellow-800",
      absent: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      normal: "正常",
      late: "迟到",
      early: "早退",
      absent: "缺勤",
    }
    return labels[status] || "未知"
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateAttendanceStats = () => {
    const total = attendanceRecords.length
    const normal = attendanceRecords.filter((r) => r.status === "normal").length
    const late = attendanceRecords.filter((r) => r.status === "late").length
    const early = attendanceRecords.filter((r) => r.status === "early").length
    const absent = attendanceRecords.filter((r) => r.status === "absent").length

    return { total, normal, late, early, absent }
  }

  const calculatePerformanceStats = () => {
    const avgRating = performanceRecords.reduce((sum, r) => sum + r.rating, 0) / performanceRecords.length
    const totalTasks = performanceRecords.reduce((sum, r) => sum + r.tasksCompleted, 0)
    const totalSalesTarget = performanceRecords.reduce((sum, r) => sum + r.salesTarget, 0)
    const totalSalesAchieved = performanceRecords.reduce((sum, r) => sum + r.salesAchieved, 0)
    const salesRate = (totalSalesAchieved / totalSalesTarget) * 100

    return { avgRating, totalTasks, salesRate }
  }

  const attendanceStats = calculateAttendanceStats()
  const performanceStats = calculatePerformanceStats()

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <Button variant={activeTab === "attendance" ? "default" : "outline"} onClick={() => setActiveTab("attendance")}>
          <Clock className="w-4 h-4 mr-2" />
          考勤管理
        </Button>
        <Button
          variant={activeTab === "performance" ? "default" : "outline"}
          onClick={() => setActiveTab("performance")}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          绩效管理
        </Button>
      </div>

      {activeTab === "attendance" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">总出勤</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceStats.total}</div>
                <p className="text-xs text-muted-foreground">今日记录</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">正常出勤</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{attendanceStats.normal}</div>
                <p className="text-xs text-muted-foreground">
                  {((attendanceStats.normal / attendanceStats.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">迟到人数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{attendanceStats.late}</div>
                <p className="text-xs text-muted-foreground">需要关注</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">平均工时</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(attendanceRecords.reduce((sum, r) => sum + r.workHours, 0) / attendanceRecords.length).toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground">每日平均</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>考勤记录</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{record.employeeName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-gray-500">{record.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">
                          {record.checkIn} - {record.checkOut}
                        </p>
                        <p className="text-xs text-gray-500">{record.workHours}小时</p>
                      </div>
                      <Badge className={`${getStatusColor(record.status)}`}>{getStatusLabel(record.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "performance" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">平均评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceStats.avgRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">满分5.0</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">任务完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceStats.totalTasks}</div>
                <p className="text-xs text-muted-foreground">本月总计</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">销售达成率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{performanceStats.salesRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">超额完成</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">优秀员工</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceRecords.filter((r) => r.rating >= 4.5).length}</div>
                <p className="text-xs text-muted-foreground">评分≥4.5</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>绩效记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{record.employeeName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-gray-500">{record.month}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className={`w-5 h-5 ${getRatingColor(record.rating)}`} />
                        <span className={`font-bold ${getRatingColor(record.rating)}`}>{record.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">任务完成</p>
                        <p className="font-semibold">{record.tasksCompleted} 个</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">销售目标</p>
                        <p className="font-semibold">¥{record.salesTarget.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500 mb-1">销售达成</p>
                        <p className="font-semibold text-green-600">¥{record.salesAchieved.toLocaleString()}</p>
                        <p className="text-xs text-green-600">
                          {((record.salesAchieved / record.salesTarget) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
