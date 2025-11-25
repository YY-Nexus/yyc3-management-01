import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type LogoVariant = "default" | "sidebar" | "footer" | "compact"

interface LogoProps {
  variant?: LogoVariant
  width?: number
  height?: number
  showText?: boolean
  href?: string
  className?: string
  darkMode?: boolean
  responsive?: boolean
}

export function Logo({
  variant = "default",
  width = 120,
  height = 60,
  showText = true,
  href,
  className,
  darkMode = false,
  responsive = false,
}: LogoProps) {
  const logoSrc = "/images/yanyu-logo.png"
  const altText = "言语云智能办公系统"

  // 根据变体调整尺寸
  const getSize = () => {
    switch (variant) {
      case "compact":
        return { width: Math.min(width, 80), height: Math.min(height, 40) }
      case "sidebar":
        return { width: Math.min(width, 100), height: Math.min(height, 50) }
      case "footer":
        return { width: Math.min(width, 80), height: Math.min(height, 40) }
      default:
        return { width, height }
    }
  }

  const { width: finalWidth, height: finalHeight } = getSize()

  const logoElement = (
    <div
      className={cn(
        "flex items-center transition-all duration-300 hover:scale-105",
        responsive && "flex-shrink-0",
        className,
      )}
    >
      <div className="relative">
        <Image
          src={logoSrc || "/placeholder.svg"}
          alt={altText}
          width={finalWidth}
          height={finalHeight}
          className={cn(
            "object-contain transition-all duration-300",
            darkMode && "brightness-0 invert",
            "drop-shadow-lg hover:drop-shadow-xl",
          )}
          priority
        />
      </div>
      {showText && (
        <div className={cn("ml-3", variant === "compact" && "hidden sm:block")}>
          <h1
            className={cn(
              "font-bold leading-tight",
              variant === "footer" ? "text-sm" : "text-lg",
              darkMode ? "text-white" : "text-slate-800",
              "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
            )}
          >
            言语云
          </h1>
          <p className={cn("text-xs leading-tight", darkMode ? "text-slate-300" : "text-slate-600")}>智能办公系统</p>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
