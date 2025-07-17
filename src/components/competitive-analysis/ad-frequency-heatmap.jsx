"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdFrequencyHeatmap = ({ data }) => {
  // Sample data for demonstration
  const sampleData = {
    stations: [
      {
        station: "Station A",
        days: [
          {
            date: "2024-01-01",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
          {
            date: "2024-01-02",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
        ],
      },
      {
        station: "Station B",
        days: [
          {
            date: "2024-01-01",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
          {
            date: "2024-01-02",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
        ],
      },
      {
        station: "Station C",
        days: [
          {
            date: "2024-01-01",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
          {
            date: "2024-01-02",
            hours: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              frequency: Math.floor(Math.random() * 100),
            })),
          },
        ],
      },
    ],
  };

  // Use sample data if no data provided
  const actualData = data?.stations?.length > 0 ? data : sampleData;

  // Get unique dates from the first station (assuming all stations have the same dates)
  const dates = actualData.stations[0]?.days.map((day) => day.date) || [];
  const [selectedDate, setSelectedDate] = useState(dates[0] || "");

  // Get data for the selected date
  const heatmapData = actualData.stations.map((station) => {
    const dayData = station.days.find((day) => day.date === selectedDate);
    return {
      station: station.station,
      frequencies: dayData
        ? dayData.hours.map((h) => h.frequency)
        : Array(24).fill(0),
    };
  });

  // Calculate max frequency for color scaling
  const maxFrequency =
    heatmapData.reduce((max, station) => {
      const stationMax = Math.max(...station.frequencies);
      return Math.max(max, stationMax);
    }, 0) || 100;

  // Generate color based on frequency
  const getCellColor = (frequency) => {
    const intensity = frequency / maxFrequency;
    return `rgba(59, 130, 246, ${intensity * 0.8 + 0.1})`;
  };

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-x-4">
        <div className="flex flex-col space-y-1">
          <CardTitle>Ad Frequency Heatmap</CardTitle>
          <CardDescription>
            This heatmap visualizes the ad frequency for different radio
            stations across 24 hours. Hover over each cell to see the exact
            frequency.
          </CardDescription>
        </div>
        <div>
          <Select
            value={selectedDate}
            onValueChange={(value) => setSelectedDate(value)}
          >
            <SelectTrigger className="w-[180px] sm:w-[240px]" id="date">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-2">
        {/* Heatmap Container */}
        <div className="w-full overflow-x-auto">
          {/* Header Row with Hour Labels */}
          <div className="grid grid-cols-[150px_repeat(24,1fr)] gap-1 mb-2">
            {/* Empty corner cell */}
            <div className="h-8 flex items-center justify-center text-xs font-medium"></div>
            {/* Hour labels */}
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="h-8 flex items-center justify-center text-xs font-medium"
              >
                {i} hr
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {heatmapData.map((station) => (
            <div
              key={station.station}
              className="grid grid-cols-[150px_repeat(24,1fr)] gap-1 mb-1"
            >
              {/* Station Label */}
              <div className="h-10 flex items-center justify-start text-xs font-medium pr-2 truncate">
                {station.station}
              </div>

              {/* Frequency Cells */}
              {station.frequencies.map((frequency, colIndex) => (
                <div
                  key={`${station.station}-${colIndex}`}
                  className="h-10 flex items-center justify-center text-xs font-medium rounded border transition-colors cursor-pointer"
                  style={{ backgroundColor: getCellColor(frequency) }}
                  title={`Station: ${station.station}, Hour: ${colIndex}:00, Frequency: ${frequency}`}
                >
                  <span className="font-mono">{frequency}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        {/* Legend */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Frequency:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs">Low</span>
            <div className="w-20 h-4 bg-gradient-to-r from-blue-100 to-blue-600 rounded"></div>
            <span className="text-xs">High</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Max: {maxFrequency}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdFrequencyHeatmap;