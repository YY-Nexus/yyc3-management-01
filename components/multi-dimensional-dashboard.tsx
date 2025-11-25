import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const performanceData = [
  { name: "张三", sales: 85, tasks: 92, attendance: 98 },
  { name: "李四", sales: 78, tasks: 88, attendance: 95 },
  { name: "王五", sales: 92, tasks: 85, attendance: 90 },
  { name: "赵六", sales: 88, tasks: 90, attendance: 97 },
]

const departmentData = [
  { name: "销售部", value: 35, color: "#3b82f6" },
  { name: "技术部", value: 25, color: "#10b981" },
  { name: "市场部", value: 20, color: "#f59e0b" },
  { name: "人事部", value: 20, color: "#ef4444" },
]

export default function MultiDimensionalDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总员工数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+2.1% 较上月</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均绩效</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+5.2% 较上月</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">出勤率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.2%</div>
            <p className="text-xs text-muted-foreground">+1.3% 较上月</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">任务完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.7%</div>
            <p className="text-xs text-muted-foreground">+3.8% 较上月</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>员工绩效对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" name="销售业绩" />
                <Bar dataKey="tasks" fill="#10b981" name="任务完成" />
                <Bar dataKey="attendance" fill="#f59e0b" name="出勤率" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>部门人员分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>关键指标趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>销售目标完成度</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>客户满意度</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>项目按时交付率</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>员工培训完成率</span>
                <span>96%</span>
              </div>
              <Progress value={96} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
