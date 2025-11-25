"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { QrCode, CreditCard, Smartphone, Banknote, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface PaymentChannel {
  id: string
  name: string
  type: "wechat" | "alipay" | "bank" | "cash"
  account: string
  qrCode?: string
  status: "active" | "inactive"
  balance?: number
}

const mockChannels: PaymentChannel[] = [
  {
    id: "1",
    name: "微信收款",
    type: "wechat",
    account: "wxpay_123456",
    qrCode: "/placeholder.svg?height=200&width=200&text=微信收款码",
    status: "active",
    balance: 15680.5,
  },
  {
    id: "2",
    name: "支付宝收款",
    type: "alipay",
    account: "alipay_789012",
    qrCode: "/placeholder.svg?height=200&width=200&text=支付宝收款码",
    status: "active",
    balance: 23450.8,
  },
  {
    id: "3",
    name: "银行转账",
    type: "bank",
    account: "6222 0000 0000 0000",
    status: "active",
    balance: 125000.0,
  },
  {
    id: "4",
    name: "现金收款",
    type: "cash",
    account: "现金柜台",
    status: "active",
    balance: 5680.0,
  },
]

export default function PaymentChannels() {
  const [channels, setChannels] = useState<PaymentChannel[]>(mockChannels)
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "wechat" as const,
    account: "",
  })
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const { toast } = useToast()

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "wechat":
        return <Smartphone className="w-5 h-5 text-green-500" />
      case "alipay":
        return <Smartphone className="w-5 h-5 text-blue-500" />
      case "bank":
        return <CreditCard className="w-5 h-5 text-purple-500" />
      case "cash":
        return <Banknote className="w-5 h-5 text-orange-500" />
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />
    }
  }

  const getChannelColor = (type: string) => {
    const colors = {
      wechat: "bg-green-100 text-green-800",
      alipay: "bg-blue-100 text-blue-800",
      bank: "bg-purple-100 text-purple-800",
      cash: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getChannelLabel = (type: string) => {
    const labels = {
      wechat: "微信支付",
      alipay: "支付宝",
      bank: "银行转账",
      cash: "现金",
    }
    return labels[type] || "其他"
  }

  const copyToClipboard = async (text: string, channelId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAccount(channelId)
      toast({
        title: "复制成功",
        description: "账号信息已复制到剪贴板",
      })
      setTimeout(() => setCopiedAccount(null), 2000)
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制账号信息",
        variant: "destructive",
      })
    }
  }

  const toggleChannelStatus = (channelId: string) => {
    setChannels(
      channels.map((channel) =>
        channel.id === channelId
          ? { ...channel, status: channel.status === "active" ? "inactive" : "active" }
          : channel,
      ),
    )
  }

  const addChannel = () => {
    if (newChannel.name && newChannel.account) {
      const channel: PaymentChannel = {
        id: Date.now().toString(),
        ...newChannel,
        status: "active",
        balance: 0,
      }
      setChannels([...channels, channel])
      setNewChannel({ name: "", type: "wechat", account: "" })
      toast({
        title: "添加成功",
        description: "新的收款通道已添加",
      })
    }
  }

  const totalBalance = channels.reduce((sum, channel) => sum + (channel.balance || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总余额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">所有通道余额</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">活跃通道</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">可用收款通道</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">今日收款</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥8,650</div>
            <p className="text-xs text-muted-foreground">+12% 较昨日</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">交易笔数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">今日交易</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">收款通道管理</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>添加通道</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加收款通道</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="channel-name">通道名称</Label>
                <Input
                  id="channel-name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  placeholder="输入通道名称"
                />
              </div>
              <div>
                <Label htmlFor="channel-type">通道类型</Label>
                <select
                  id="channel-type"
                  value={newChannel.type}
                  onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="wechat">微信支付</option>
                  <option value="alipay">支付宝</option>
                  <option value="bank">银行转账</option>
                  <option value="cash">现金</option>
                </select>
              </div>
              <div>
                <Label htmlFor="channel-account">账号信息</Label>
                <Input
                  id="channel-account"
                  value={newChannel.account}
                  onChange={(e) => setNewChannel({ ...newChannel, account: e.target.value })}
                  placeholder="输入账号信息"
                />
              </div>
              <Button onClick={addChannel} className="w-full">
                添加通道
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className={`${channel.status === "inactive" ? "opacity-60" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {getChannelIcon(channel.type)}
                <CardTitle className="text-sm font-medium">{channel.name}</CardTitle>
              </div>
              <Badge className={`text-xs ${getChannelColor(channel.type)}`}>{getChannelLabel(channel.type)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">账号信息</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{channel.account}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(channel.account, channel.id)}>
                      {copiedAccount === channel.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {channel.balance !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">余额</p>
                    <p className="text-lg font-semibold text-green-600">¥{channel.balance.toLocaleString()}</p>
                  </div>
                )}

                {channel.qrCode && (
                  <div className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <QrCode className="w-4 h-4 mr-2" />
                          查看收款码
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{channel.name} 收款码</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center p-4">
                          <img
                            src={channel.qrCode || "/placeholder.svg"}
                            alt={`${channel.name}收款码`}
                            className="w-48 h-48 border rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Badge variant={channel.status === "active" ? "default" : "secondary"}>
                    {channel.status === "active" ? "启用" : "禁用"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => toggleChannelStatus(channel.id)}>
                    {channel.status === "active" ? "禁用" : "启用"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
