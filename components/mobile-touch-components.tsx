"use client"

import { useState, useRef, type ReactNode } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { Trash2, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TouchCardProps {
  children: ReactNode
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export function TouchCard({ children, onLongPress, onSwipeLeft, onSwipeRight, className = "" }: TouchCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const pressTimer = useRef<NodeJS.Timeout>()
  const controls = useAnimation()

  const handlePressStart = () => {
    setIsPressed(true)
    pressTimer.current = setTimeout(() => {
      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      onLongPress?.()
    }, 500)
  }

  const handlePressEnd = () => {
    setIsPressed(false)
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
    }
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipeRight?.()
      controls.start({ x: 0, opacity: 1 })
    } else if (info.offset.x < -threshold) {
      onSwipeLeft?.()
      controls.start({ x: 0, opacity: 1 })
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
  }

  return (
    <motion.div
      className={className}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
      style={{ touchAction: "pan-y" }}
    >
      <Card className={`transition-shadow ${isPressed ? "shadow-lg" : ""}`}>{children}</Card>
    </motion.div>
  )
}

interface SwipeActionProps {
  children: ReactNode
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  className?: string
}

export function SwipeAction({ children, onEdit, onDelete, onShare, className = "" }: SwipeActionProps) {
  const [swipeState, setSwipeState] = useState<"left" | "right" | "none">("none")
  const controls = useAnimation()

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80
    if (info.offset.x > threshold) {
      setSwipeState("right")
      controls.start({ x: 80 })
    } else if (info.offset.x < -threshold) {
      setSwipeState("left")
      controls.start({ x: -80 })
    } else {
      setSwipeState("none")
      controls.start({ x: 0 })
    }
  }

  const handleAction = (action?: () => void) => {
    if (action) {
      action()
    }
    setSwipeState("none")
    controls.start({ x: 0 })
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 左侧操作按钮 */}
      {swipeState === "right" && (
        <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-blue-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAction(onEdit)}
            className="text-white hover:text-white hover:bg-blue-600"
          >
            <Edit size={20} />
          </Button>
        </div>
      )}

      {/* 右侧操作按钮 */}
      {swipeState === "left" && (
        <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-red-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAction(onDelete)}
            className="text-white hover:text-white hover:bg-red-600"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      )}

      {/* 可滑动内容 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

interface LongPressMenuProps {
  trigger: ReactNode
  items: Array<{
    label: string
    icon: ReactNode
    onClick: () => void
    variant?: "default" | "destructive"
  }>
}

export function LongPressMenu({ trigger, items }: LongPressMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pressTimer = useRef<NodeJS.Timeout>()

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      setIsOpen(true)
    }, 500)
  }

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
    }
  }

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div onPointerDown={handlePressStart} onPointerUp={handlePressEnd} onPointerCancel={handlePressEnd}>
        {trigger}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg z-50 min-w-[200px]"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 ${
                  index === 0 ? "rounded-t-lg" : ""
                } ${index === items.length - 1 ? "rounded-b-lg" : ""} ${
                  item.variant === "destructive" ? "text-red-600" : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}

export function PullToRefresh({
  children,
  onRefresh,
}: {
  children: ReactNode
  onRefresh: () => Promise<void>
}) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const controls = useAnimation()

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 && !isRefreshing) {
      setIsRefreshing(true)
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      await onRefresh()
      setIsRefreshing(false)
      controls.start({ y: 0 })
    } else {
      controls.start({ y: 0 })
    }
    setIsPulling(false)
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDrag={(_, info) => {
        if (info.offset.y > 0) {
          setIsPulling(true)
        }
      }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      {(isPulling || isRefreshing) && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      {children}
    </motion.div>
  )
}
