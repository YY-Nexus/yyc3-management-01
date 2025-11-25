"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/sidebar"
import { FileUploader } from "@/components/file-uploader"
import { RecentFiles } from "@/components/recent-files"

export default function DocumentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [addWatermark, setAddWatermark] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里应该是实际的提交逻辑
    console.log("Submitted:", { title, content, addWatermark })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-auto p-6">
        <Button className="mb-4" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "关闭侧边栏" : "打开侧边栏"}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>工作通知</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入通知标题"
                />
              </div>
              <div>
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入通知内容"
                  rows={5}
                />
              </div>
              <FileUploader addWatermark={addWatermark} />
              <div className="flex items-center space-x-2">
                <Switch id="watermark" checked={addWatermark} onCheckedChange={setAddWatermark} />
                <Label htmlFor="watermark">添加水印</Label>
              </div>
              <Button type="submit">发布通知</Button>
            </form>
          </CardContent>
        </Card>
        <RecentFiles />
      </div>
    </div>
  )
}
