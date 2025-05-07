"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"


export function TimeRangeBrush({ value, onChange, className, isLoading = false }) {
  const trackRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [dragStartValue, setDragStartValue] = useState([0, 0])

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  const handleMouseDown = (e, handle) => {
    e.preventDefault()
    setIsDragging(handle)
    setStartPos(e.clientX)
    setDragStartValue([value[0], value[1]])
  }

  const handleTrackClick = (e) => {
    if (isDragging || isLoading) return
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const minutes = Math.round(percent * 24 * 60)

    // Determine if we should move the start or end handle based on which is closer
    const distToStart = Math.abs(minutes - value[0])
    const distToEnd = Math.abs(minutes - value[1])

    if (distToStart < distToEnd) {
      onChange([Math.min(minutes, value[1] - 30), value[1]])
    } else {
      onChange([value[0], Math.max(minutes, value[0] + 30)])
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !trackRef.current || isLoading) return

      const rect = trackRef.current.getBoundingClientRect()
      const delta = e.clientX - startPos
      const percentDelta = delta / rect.width
      const minutesDelta = Math.round(percentDelta * 24 * 60)

      if (isDragging === "start") {
        const newStart = Math.max(0, Math.min(dragStartValue[0] + minutesDelta, dragStartValue[1] - 30))
        onChange([newStart, value[1]])
      } else if (isDragging === "end") {
        const newEnd = Math.min(24 * 60, Math.max(dragStartValue[1] + minutesDelta, dragStartValue[0] + 30))
        onChange([value[0], newEnd])
      } else if (isDragging === "middle") {
        const rangeWidth = dragStartValue[1] - dragStartValue[0]
        let newStart = dragStartValue[0] + minutesDelta
        let newEnd = dragStartValue[1] + minutesDelta

        if (newStart < 0) {
          newStart = 0
          newEnd = rangeWidth
        }

        if (newEnd > 24 * 60) {
          newEnd = 24 * 60
          newStart = newEnd - rangeWidth
        }

        onChange([newStart, newEnd])
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startPos, dragStartValue, onChange, value, isLoading])

  const startPercent = (value[0] / (24 * 60)) * 100
  const endPercent = (value[1] / (24 * 60)) * 100
  const rangePercent = endPercent - startPercent

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="flex items-center mb-2">
        <Clock className="w-4 h-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Time Range</span>
      </div>

      <div className="relative h-12 mt-6 mb-2">
        {/* Time markers */}
        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>

        {/* Track with hour divisions */}
        <div
          ref={trackRef}
          className="absolute h-3 w-full bg-gray-100 rounded-full top-1/2 -translate-y-1/2 cursor-pointer overflow-hidden"
          onClick={handleTrackClick}
        >
          {/* Hour divisions */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="h-full flex-1 border-r border-gray-200 last:border-r-0"
                style={{ opacity: i % 6 === 0 ? 0.8 : 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Selected range */}
        <div
          className={cn(
            "absolute h-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full top-1/2 -translate-y-1/2 cursor-grab transition-opacity",
            isLoading && "opacity-50",
          )}
          style={{
            left: `${startPercent}%`,
            width: `${rangePercent}%`,
          }}
          onMouseDown={(e) => !isLoading && handleMouseDown(e, "middle")}
        />

        {/* Start handle */}
        <div
          className={cn(
            "absolute w-5 h-5 bg-black rounded-full border border-gray-200 shadow-lg top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-10 transition-all",
            isDragging === "start" && "scale-110",
            isLoading && "opacity-50",
          )}
          style={{ left: `${startPercent}%` }}
          onMouseDown={(e) => !isLoading && handleMouseDown(e, "start")}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* End handle */}
        <div
          className={cn(
            "absolute w-5 h-5 bg-black rounded-full border border-gray-200 shadow-lg top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-10 transition-all",
            isDragging === "end" && "scale-110",
            isLoading && "opacity-50",
          )}
          style={{ left: `${endPercent}%` }}
          onMouseDown={(e) => !isLoading && handleMouseDown(e, "end")}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm font-medium mt-2">
        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-800">{minutesToTime(value[0])}</span>
        <span className="text-xs text-gray-500 self-center">
          {Math.floor((value[1] - value[0]) / 60)}h {(value[1] - value[0]) % 60}m
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-800">{minutesToTime(value[1])}</span>
      </div>
    </div>
  )
}
