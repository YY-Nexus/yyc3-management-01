"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RealTimeDashboard } from "@/components/real-time-dashboard"
import { InteractiveDashboard } from "@/components/interactive-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">数据仪表盘</h1>
        <p className="text-slate-600 mt-2">实时监控和多维度数据分析</p>
      </div>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList>
          <TabsTrigger value="realtime">实时监控</TabsTrigger>
          <TabsTrigger value="interactive">交互分析</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeDashboard />
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <InteractiveDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
