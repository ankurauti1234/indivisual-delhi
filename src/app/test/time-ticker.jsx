"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"


export function TimeTicker({ timeRange, className }) {
  const [currentTime, setCurrentTime] = useState(0)
  
  useEffect(() => {
    // Get current time in minutes
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    setCurrentTime(currentMinutes)
    
    // Update every minute
    const interval = setInterval(() => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      setCurrentTime(currentMinutes)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Check if current time is within the visible range
  if (currentTime < timeRange[0] || currentTime > timeRange[1]) {
    return null
  }
  
  const totalMinutes = timeRange[1] - timeRange[0]
  const position = ((currentTime - timeRange[0]) / totalMinutes) * 100
  
  const hours = Math.floor(currentTime / 60)
  const minutes = currentTime % 60
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  
  return (
    <div 
      className={cn("absolute top-0 bottom-0 w-px bg-red-500 z-20", className)}
      style={{ left: `${position}%` }}
    >
      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
        {timeString}
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-red-500"></div>
    </div>
  )
}
