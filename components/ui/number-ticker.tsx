"use client"

import { useEffect, useRef, useState } from "react"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  duration?: number
  className?: string
  start?: number
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  duration = 2000,
  className,
  start = 0,
}: NumberTickerProps) {
  const [currentValue, setCurrentValue] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < delay) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const elapsed = progress - delay
      const easedProgress = Math.min(1, elapsed / duration)

      const startValue = direction === "up" ? start : value
      const endValue = direction === "up" ? value : start
      const newValue = Math.floor(startValue + easedProgress * (endValue - startValue))

      setCurrentValue(newValue)

      if (easedProgress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCurrentValue(endValue)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, direction, delay, duration, start])

  return (
    <span ref={ref} className={className}>
      {currentValue.toLocaleString()}
    </span>
  )
}

