"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export function HourSelector({ onSelectHour, currentHour, className }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {hours.map((hour) => (
        <Button
          key={hour}
          variant={currentHour === hour ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 w-12 text-xs font-medium",
            currentHour === hour ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          )}
          onClick={() => onSelectHour(hour)}
        >
          {hour.toString().padStart(2, "0")}:00
        </Button>
      ))}
    </div>
  )
}
