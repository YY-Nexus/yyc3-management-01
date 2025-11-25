import type React from "react"
import { cn } from "@/lib/utils"

interface TreeProps {
  children: React.ReactNode
  className?: string
}

interface TreeNodeProps {
  label: string
  children?: React.ReactNode
  className?: string
}

export function Tree({ children, className }: TreeProps) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

export function TreeNode({ label, children, className }: TreeNodeProps) {
  return (
    <div className={cn("", className)}>
      <div className="flex items-center py-1 px-2 hover:bg-gray-100 rounded">
        <span className="text-sm font-medium">{label}</span>
      </div>
      {children && <div className="ml-4 border-l border-gray-200 pl-2">{children}</div>}
    </div>
  )
}
