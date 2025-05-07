"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Clock, Music, Radio, ShoppingBag, Loader2 } from "lucide-react"
import epgData from "./epg_data.json"
import { TimeRangeBrush } from "./time-range-brush"
import { HourSelector } from "./hour-selector"
import { TimeTicker } from "./time-ticker"
// Removed useDebounce import

// Utility Functions
const timeToMinutes = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number)
  return hours * 60 + minutes + seconds / 60
}

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

// Calculate visible ticks based on zoom level
const calculateVisibleTicks = (timeRange) => {
  const totalMinutes = timeRange[1] - timeRange[0]
  // Adjust tick interval based on zoom level
  let interval = 30 // Default 30 minutes

  if (totalMinutes <= 120) {
    // 2 hours or less
    interval = 10
  } else if (totalMinutes <= 240) {
    // 4 hours or less
    interval = 15
  } else if (totalMinutes <= 480) {
    // 8 hours or less
    interval = 30
  } else {
    interval = 60
  }

  const startTick = Math.floor(timeRange[0] / interval) * interval
  const ticks = []

  for (let i = startTick; i <= timeRange[1]; i += interval) {
    if (i >= timeRange[0]) {
      ticks.push(i)
    }
  }

  return ticks
}

// Atoms
const TimeTick = ({ time, timeRange }) => {
  const totalMinutes = timeRange[1] - timeRange[0]
  const tickSize = totalMinutes <= 240 ? "text-sm" : "text-xs"
  const tickHeight = totalMinutes <= 240 ? "h-6" : "h-4"

  return (
    <motion.div
      className="flex-1 text-center relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className={`absolute -top-7 left-1/2 transform -translate-x-1/2 font-medium ${tickSize} text-gray-700`}>
        {minutesToTime(time)}
      </span>
      <div className={`${tickHeight} border-l border-gray-300`} />
    </motion.div>
  )
}

const ProgramBlock = ({ item, timeRange, onSelect, isVertical }) => {
  const start = timeToMinutes(item.start)
  const end = timeToMinutes(item.end)
  const totalMinutes = timeRange[1] - timeRange[0]

  // Calculate position and size
  const left = ((start - timeRange[0]) / totalMinutes) * 100
  const width = ((end - start) / totalMinutes) * 100

  // For vertical layout
  const top = isVertical ? left : undefined
  const height = isVertical ? width : undefined

  const programStyles = {
    song: {
      bg: "bg-blue-500",
      icon: <Music className="w-4 h-4 mr-1" />,
      shadow: "shadow-sm",
    },
    jingle: {
      bg: "bg-purple-500",
      icon: <Radio className="w-4 h-4 mr-1" />,
      shadow: "shadow-sm",
    },
    advertisement: {
      bg: "bg-amber-500",
      icon: <ShoppingBag className="w-4 h-4 mr-1" />,
      shadow: "shadow-sm",
    },
    default: {
      bg: "bg-gray-500",
      icon: <Clock className="w-4 h-4 mr-1" />,
      shadow: "shadow-sm",
    },
  }

  const style = programStyles[item.type] || programStyles.default

  return (
    <motion.div
      className={cn(
        "absolute rounded-md shadow-sm transition-transform cursor-pointer border border-white/10",
        style.bg,
        style.shadow,
        isVertical ? "w-full" : "h-14",
      )}
      style={
        isVertical
          ? {
              top: `${top}%`,
              height: `${Math.max(height, 1)}%`,
              left: 0,
              right: 0,
            }
          : {
              left: `${left}%`,
              width: `${Math.max(width, 1)}%`,
              top: "0.5rem",
            }
      }
      whileHover={{
        scale: 1.02,
        zIndex: 20,
      }}
      onClick={() => onSelect(item)}
    >
      <div className={cn("p-2 text-white text-sm truncate flex items-center", isVertical ? "h-auto" : "h-full")}>
        {style.icon}
        <span className="font-medium">{item.program.split(",")[0]}</span>
      </div>
    </motion.div>
  )
}

const ChannelName = ({ name, isVertical }) => (
  <div
    className={cn(
      "font-medium text-gray-800 flex items-center p-3 bg-white border-gray-100 shadow-sm",
      isVertical ? "w-full border-b" : "w-36 flex-shrink-0 border-r sticky left-0 z-10",
    )}
  >
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">{name.charAt(0)}</div>
    <span>{name}</span>
  </div>
)

// Molecules
const Timeline = ({ timeRange, isVertical }) => {
  const ticks = calculateVisibleTicks(timeRange)

  return (
    <div
      className={cn(
        "border-gray-100 bg-white sticky z-10 shadow-sm",
        isVertical ? "h-full w-12 border-r flex flex-col" : "h-16 border-b flex",
      )}
    >
      <div className={isVertical ? "h-36 flex-shrink-0" : "w-36 flex-shrink-0 bg-white border-r border-gray-100"} />
      <div className={isVertical ? "flex flex-col flex-1" : "flex flex-1"}>
        {ticks.map((tick) => (
          <TimeTick key={tick} time={tick} timeRange={timeRange} />
        ))}
      </div>
    </div>
  )
}

const ChannelRow = ({ channel, programs, timeRange, onSelectProgram, isVertical }) => (
  <div
    className={cn(
      "border-gray-200 hover:bg-gray-50 transition-colors",
      isVertical ? "flex flex-col border-r" : "flex border-b",
    )}
  >
    <ChannelName name={channel} isVertical={isVertical} />
    <div className={cn("relative", isVertical ? "h-[300px]" : "flex-1 h-20")}>
      <AnimatePresence>
        {programs.map((item) => (
          <ProgramBlock
            key={item.id}
            item={item}
            timeRange={timeRange}
            onSelect={onSelectProgram}
            isVertical={isVertical}
          />
        ))}
      </AnimatePresence>
      {/* <TimeTicker timeRange={timeRange} /> */}
    </div>
  </div>
)

const ProgramDialog = ({ program, isOpen, onClose }) => {
  if (!program) return null

  const programIcons = {
    song: <Music className="w-5 h-5 text-blue-500" />,
    jingle: <Radio className="w-5 h-5 text-purple-500" />,
    advertisement: <ShoppingBag className="w-5 h-5 text-amber-500" />,
  }

  const programColors = {
    song: "bg-blue-50 text-blue-800 border-blue-200",
    jingle: "bg-purple-50 text-purple-800 border-purple-200",
    advertisement: "bg-amber-50 text-amber-800 border-amber-200",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {programIcons[program.type]}
            {program.program.split(",")[0]}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                {program.start} - {program.end}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${programColors[program.type]}`}>
            <p className="text-sm">{program.program}</p>
          </div>

          {program.audio && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-2 text-gray-700">Preview Audio</h4>
              <audio controls className="w-full rounded-md shadow-sm">
                <source src={program.audio} type="audio/mp3" />
              </audio>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Schedule</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Organism
const EPGGrid = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-04-17"))
  const [timeRange, setTimeRange] = useState([0, 24 * 60])
  const [data, setData] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentHour, setCurrentHour] = useState(null)

  // Detect small screens
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Update loading state directly when time range changes
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [timeRange])

  useEffect(() => {
    setData(epgData)
  }, [])

  const filteredData = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    return data.filter(
      (item) =>
        item.date === dateStr &&
        timeToMinutes(item.start) >= timeRange[0] &&
        timeToMinutes(item.end) <= timeRange[1],
    )
  }, [selectedDate, timeRange, data])

  const channels = useMemo(() => {
    return [...new Set(filteredData.map((item) => item.channel))]
  }, [filteredData])

  const handleProgramSelect = (program) => {
    setSelectedProgram(program)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSelectHour = useCallback((hour) => {
    setCurrentHour(hour)
    setTimeRange([hour * 60, (hour + 1) * 60])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Program Guide</h1>
          <div className="text-sm text-gray-500">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-48 rounded-md bg-white hover:bg-gray-50 border-gray-200 shadow-sm flex items-center gap-2"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
              </Button>

              <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogContent className="p-0 bg-white rounded-lg shadow-xl border-0 max-w-sm">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setIsCalendarOpen(false)
                    }}
                    className="rounded-md border-0 p-4"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <TimeRangeBrush
              value={timeRange}
              onChange={setTimeRange}
              className="w-full md:w-96 px-4"
              isLoading={isLoading}
            />
          </div>

          {/* Hour selector */}
          <div className="w-full overflow-x-auto pb-2">
            <HourSelector onSelectHour={handleSelectHour} currentHour={currentHour} className="min-w-max" />
          </div>
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center p-4 bg-white/80 rounded-lg shadow-sm border border-gray-200">
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Loading programs...</span>
          </div>
        )}

        {/* Grid */}
        <div className="relative overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
          {isSmallScreen ? (
            // Vertical layout for small screens
            <div className="flex">
              {channels.map((channel) => (
                <ChannelRow
                  key={channel}
                  channel={channel}
                  programs={filteredData.filter((item) => item.channel === channel)}
                  timeRange={timeRange}
                  onSelectProgram={handleProgramSelect}
                  isVertical={true}
                />
              ))}
            </div>
          ) : (
            // Horizontal layout for larger screens
            <div className="min-w-[1200px]">
              <Timeline timeRange={timeRange} isVertical={false} />
              {channels.map((channel) => (
                <ChannelRow
                  key={channel}
                  channel={channel}
                  programs={filteredData.filter((item) => item.channel === channel)}
                  timeRange={timeRange}
                  onSelectProgram={handleProgramSelect}
                  isVertical={false}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {channels.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No programs found</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Try adjusting your time range or selecting a different date to see available programs.
              </p>
            </div>
          )}
        </div>

        {/* Program Dialog */}
        <ProgramDialog program={selectedProgram} isOpen={isDialogOpen} onClose={handleCloseDialog} />
      </div>
    </div>
  )
}

export default EPGGrid