import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  level: number
  avatar?: string
  subordinates?: Employee[]
}

const organizationData: Employee = {
  id: "1",
  name: "王总",
  position: "总经理",
  department: "管理层",
  level: 0,
  subordinates: [
    {
      id: "2",
      name: "张副总",
      position: "副总经理",
      department: "管理层",
      level: 1,
      subordinates: [
        {
          id: "3",
          name: "李经理",
          position: "销售经理",
          department: "销售部",
          level: 2,
          subordinates: [
            { id: "4", name: "赵主管", position: "销售主管", department: "销售部", level: 3 },
            { id: "5", name: "钱主管", position: "销售主管", department: "销售部", level: 3 },
          ],
        },
        {
          id: "6",
          name: "孙经理",
          position: "技术经理",
          department: "技术部",
          level: 2,
          subordinates: [
            { id: "7", name: "周主管", position: "开发主管", department: "技术部", level: 3 },
            { id: "8", name: "吴主管", position: "测试主管", department: "技术部", level: 3 },
          ],
        },
      ],
    },
    {
      id: "9",
      name: "郑经理",
      position: "人事经理",
      department: "人事部",
      level: 1,
      subordinates: [
        { id: "10", name: "冯主管", position: "招聘主管", department: "人事部", level: 2 },
        { id: "11", name: "陈主管", position: "培训主管", department: "人事部", level: 2 },
      ],
    },
  ],
}

function EmployeeNode({ employee }: { employee: Employee }) {
  const getDepartmentColor = (department: string) => {
    const colors = {
      管理层: "bg-purple-100 text-purple-800",
      销售部: "bg-blue-100 text-blue-800",
      技术部: "bg-green-100 text-green-800",
      人事部: "bg-orange-100 text-orange-800",
      财务部: "bg-red-100 text-red-800",
    }
    return colors[department] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-48 mb-4 hover:shadow-lg transition-shadow">
        <CardContent className="p-4 text-center">
          <Avatar className="w-12 h-12 mx-auto mb-2">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
            <AvatarFallback>{employee.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-sm">{employee.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{employee.position}</p>
          <Badge className={`text-xs ${getDepartmentColor(employee.department)}`}>{employee.department}</Badge>
        </CardContent>
      </Card>

      {employee.subordinates && employee.subordinates.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 left-1/2 w-px h-4 bg-gray-300 transform -translate-x-1/2"></div>
          <div className="flex space-x-8 pt-4">
            {employee.subordinates.map((subordinate, index) => (
              <div key={subordinate.id} className="relative">
                {index > 0 && (
                  <div className="absolute top-0 left-0 w-full h-px bg-gray-300 transform -translate-y-4"></div>
                )}
                <div className="absolute top-0 left-1/2 w-px h-4 bg-gray-300 transform -translate-x-1/2 -translate-y-4"></div>
                <EmployeeNode employee={subordinate} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrganizationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>组织架构图</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="min-w-max">
            <EmployeeNode employee={organizationData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
