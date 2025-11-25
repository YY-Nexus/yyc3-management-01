"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Award, Star, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Honor {
  id: string
  employeeName: string
  title: string
  description: string
  date: string
  type: "monthly" | "quarterly" | "annual" | "special"
  amount?: number
}

interface FundRecord {
  id: string
  employeeName: string
  amount: number
  reason: string
  date: string
  type: "bonus" | "welfare" | "training" | "other"
}

const mockHonors: Honor[] = [
  {
    id: "1",
    employeeName: "张三",
    title: "月度最佳员工",
    description: "在销售业绩方面表现突出，超额完成目标120%",
    date: "2024-01-15",
    type: "monthly",
    amount: 2000,
  },
  {
    id: "2",
    employeeName: "李四",
    title: "技术创新奖",
    description: "开发的新系统模块大幅提升了工作效率",
    date: "2024-01-10",
    type: "special",
    amount: 5000,
  },
]

const mockFundRecords: FundRecord[] = [
  {
    id: "1",
    employeeName: "张三",
    amount: 2000,
    reason: "月度最佳员工奖金",
    date: "2024-01-15",
    type: "bonus",
  },
  {
    id: "2",
    employeeName: "王五",
    amount: 1500,
    reason: "培训费用报销",
    date: "2024-01-12",
    type: "training",
  },
]

export default function EmployeeHonorFund() {
  const [honors, setHonors] = useState<Honor[]>(mockHonors)
  const [fundRecords, setFundRecords] = useState<FundRecord[]>(mockFundRecords)
  const [newHonor, setNewHonor] = useState({
    employeeName: "",
    title: "",
    description: "",
    type: "monthly" as const,
    amount: 0,
  })
  const [newFundRecord, setNewFundRecord] = useState({
    employeeName: "",
    amount: 0,
    reason: "",
    type: "bonus" as const,
  })

  const getHonorIcon = (type: string) => {
    switch (type) {
      case "monthly":
        return <Star className="w-4 h-4 text-yellow-500" />
      case "quarterly":
        return <Award className="w-4 h-4 text-blue-500" />
      case "annual":
        return <Trophy className="w-4 h-4 text-gold-500" />
      case "special":
        return <Gift className="w-4 h-4 text-purple-500" />
      default:
        return <Star className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      monthly: "bg-yellow-100 text-yellow-800",
      quarterly: "bg-blue-100 text-blue-800",
      annual: "bg-purple-100 text-purple-800",
      special: "bg-green-100 text-green-800",
      bonus: "bg-green-100 text-green-800",
      welfare: "bg-blue-100 text-blue-800",
      training: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const addHonor = () => {
    if (newHonor.employeeName && newHonor.title) {
      const honor: Honor = {
        id: Date.now().toString(),
        ...newHonor,
        date: new Date().toISOString().split("T")[0],
      }
      setHonors([honor, ...honors])
      setNewHonor({
        employeeName: "",
        title: "",
        description: "",
        type: "monthly",
        amount: 0,
      })
    }
  }

  const addFundRecord = () => {
    if (newFundRecord.employeeName && newFundRecord.amount > 0) {
      const record: FundRecord = {
        id: Date.now().toString(),
        ...newFundRecord,
        date: new Date().toISOString().split("T")[0],
      }
      setFundRecords([record, ...fundRecords])
      setNewFundRecord({
        employeeName: "",
        amount: 0,
        reason: "",
        type: "bonus",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">本月荣誉总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{honors.length}</div>
            <p className="text-xs text-muted-foreground">较上月 +15%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">奖励基金总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{fundRecords.reduce((sum, record) => sum + record.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">本月发放</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">受奖员工数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(honors.map((h) => h.employeeName)).size}</div>
            <p className="text-xs text-muted-foreground">占总员工 12%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>员工荣誉</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">添加荣誉</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加员工荣誉</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="employee-name">员工姓名</Label>
                    <Input
                      id="employee-name"
                      value={newHonor.employeeName}
                      onChange={(e) => setNewHonor({ ...newHonor, employeeName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="honor-title">荣誉称号</Label>
                    <Input
                      id="honor-title"
                      value={newHonor.title}
                      onChange={(e) => setNewHonor({ ...newHonor, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="honor-description">描述</Label>
                    <Textarea
                      id="honor-description"
                      value={newHonor.description}
                      onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="honor-amount">奖金金额</Label>
                    <Input
                      id="honor-amount"
                      type="number"
                      value={newHonor.amount}
                      onChange={(e) => setNewHonor({ ...newHonor, amount: Number(e.target.value) })}
                    />
                  </div>
                  <Button onClick={addHonor} className="w-full">
                    添加荣誉
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {honors.map((honor) => (
                <div key={honor.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">{getHonorIcon(honor.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{honor.title}</h3>
                      <Badge className={`text-xs ${getTypeColor(honor.type)}`}>
                        {honor.type === "monthly"
                          ? "月度"
                          : honor.type === "quarterly"
                            ? "季度"
                            : honor.type === "annual"
                              ? "年度"
                              : "特殊"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{honor.employeeName}</p>
                    <p className="text-xs text-gray-500 mt-1">{honor.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{honor.date}</span>
                      {honor.amount && <span className="text-sm font-medium text-green-600">¥{honor.amount}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>基金记录</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">添加记录</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加基金记录</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fund-employee">员工姓名</Label>
                    <Input
                      id="fund-employee"
                      value={newFundRecord.employeeName}
                      onChange={(e) => setNewFundRecord({ ...newFundRecord, employeeName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fund-amount">金额</Label>
                    <Input
                      id="fund-amount"
                      type="number"
                      value={newFundRecord.amount}
                      onChange={(e) => setNewFundRecord({ ...newFundRecord, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fund-reason">原因</Label>
                    <Input
                      id="fund-reason"
                      value={newFundRecord.reason}
                      onChange={(e) => setNewFundRecord({ ...newFundRecord, reason: e.target.value })}
                    />
                  </div>
                  <Button onClick={addFundRecord} className="w-full">
                    添加记录
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fundRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{record.employeeName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{record.employeeName}</p>
                      <p className="text-xs text-gray-500">{record.reason}</p>
                      <p className="text-xs text-gray-400">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">¥{record.amount}</p>
                    <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                      {record.type === "bonus"
                        ? "奖金"
                        : record.type === "welfare"
                          ? "福利"
                          : record.type === "training"
                            ? "培训"
                            : "其他"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
