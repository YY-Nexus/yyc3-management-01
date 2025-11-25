"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RecentFile {
  id: string
  name: string
  type: string
  size: string
  modifiedAt: string
  author: string
}

const mockFiles: RecentFile[] = [
  {
    id: "1",
    name: "月度工作报告.docx",
    type: "document",
    size: "2.3 MB",
    modifiedAt: "2小时前",
    author: "张三",
  },
  {
    id: "2",
    name: "项目计划书.pdf",
    type: "pdf",
    size: "1.8 MB",
    modifiedAt: "1天前",
    author: "李四",
  },
  {
    id: "3",
    name: "会议纪要.txt",
    type: "text",
    size: "156 KB",
    modifiedAt: "3天前",
    author: "王五",
  },
]

export function RecentFiles() {
  const handleDownload = (file: RecentFile) => {
    // 实际下载逻辑
    console.log("下载文件:", file.name)
  }

  const handlePreview = (file: RecentFile) => {
    // 实际预览逻辑
    console.log("预览文件:", file.name)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>最近文件</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.size} • {file.modifiedAt} • {file.author}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handlePreview(file)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>重命名</DropdownMenuItem>
                    <DropdownMenuItem>移动</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">删除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
