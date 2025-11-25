"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export default function Settings() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [useExternalModel, setUseExternalModel] = useState(false)
  const [externalModelUrl, setExternalModelUrl] = useState("")

  const handleSave = () => {
    // 这里应该保存设置到后端或本地存储
    console.log("Saving settings:", { apiKey, model, useExternalModel, externalModelUrl })
    toast({
      title: "设置已保存",
      description: "您的系统设置已成功更新",
    })
  }

  const handleTest = () => {
    // 这里应该测试API连接
    console.log("Testing API connection")
    toast({
      title: "API连接测试",
      description: "连接测试成功",
    })
  }

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>

      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="use-external-model">使用外部AI模型</Label>
          <Switch id="use-external-model" checked={useExternalModel} onCheckedChange={setUseExternalModel} />
        </div>

        {useExternalModel && (
          <>
            <div className="space-y-2">
              <Label htmlFor="external-model-url">外部模型URL</Label>
              <Input
                id="external-model-url"
                value={externalModelUrl}
                onChange={(e) => setExternalModelUrl(e.target.value)}
                placeholder="输入外部模型的API地址"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="api-key">API密钥</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="输入您的API密钥"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">选择模型</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="选择AI模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="claude-v1">Claude v1</SelectItem>
              <SelectItem value="claude-instant-v1">Claude Instant v1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleTest} className="btn-3d">
          测试API连接
        </Button>

        <Button onClick={handleSave} className="btn-3d">
          保存设置
        </Button>
      </div>
    </div>
  )
}
