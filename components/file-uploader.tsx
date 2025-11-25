"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, File, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FileUploaderProps {
  addWatermark?: boolean
  onFileUpload?: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function FileUploader({
  addWatermark = false,
  onFileUpload,
  maxFiles = 5,
  acceptedTypes = [".pdf", ".doc", ".docx", ".txt", ".jpg", ".png"],
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "文件数量超限",
        description: `最多只能上传 ${maxFiles} 个文件`,
        variant: "destructive",
      })
      return
    }

    const newFiles = [...uploadedFiles, ...files]
    setUploadedFiles(newFiles)
    onFileUpload?.(newFiles)

    toast({
      title: "文件上传成功",
      description: `已上传 ${files.length} 个文件${addWatermark ? "，将添加水印" : ""}`,
    })
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFileUpload?.(newFiles)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">上传文件</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>选择文件</span>
                <Input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileUpload}
                />
              </label>
              <p className="pl-1">或拖拽到此处</p>
            </div>
            <p className="text-xs text-gray-500">
              支持 {acceptedTypes.join(", ")} 格式，最多 {maxFiles} 个文件
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>已上传的文件</Label>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
