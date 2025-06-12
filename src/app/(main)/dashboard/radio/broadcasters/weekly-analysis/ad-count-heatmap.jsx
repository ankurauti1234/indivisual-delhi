"use client";
import React, { useState } from "react";
import { Radio, Clock, Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { radio_mirchi, club_fm, radio_mango, red_fm } from "./heatmap-data.js";

const RadioAdHeatmap = () => {
  const [selectedDate, setSelectedDate] = useState("2025-04-16");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Check if data is missing
  if (!radio_mirchi || !club_fm || !radio_mango || !red_fm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Data for one or more stations is missing. Please check heatmap-data.js.</p>
        </CardContent>
      </Card>
    );
  }

  const allData = {
    radio_mirchi: radio_mirchi || {},
    club_fm: club_fm || {},
    radio_mango: radio_mango || {},
    red_fm: red_fm || {},
  };

  const dates = [];
  const startDate = new Date("2025-04-16");
  const endDate = new Date("2025-04-30");
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push({
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  }

  const processData = (date) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}`);
    const stations = ["RED FM", "Club FM", "Mango", "Mirchi"];
    const stationKeys = {
      "RED FM": "red_fm",
      "Club FM": "club_fm",
      "Mango": "radio_mango",
      "Mirchi": "radio_mirchi",
    };

    const matrix = stations.map((station) => {
      const stationKey = stationKeys[station];
      const stationData = { station, noData: false };
      const dataForDate = (allData[stationKey] && allData[stationKey][date]) || null;
      if (!dataForDate) {
        stationData.noData = true;
        return stationData;
      }
      hours.forEach((hour) => {
        stationData[hour] = dataForDate[hour] || 0;
      });
      return stationData;
    });

    return matrix;
  };

  const matrix = processData(selectedDate);

  const values = matrix
    .filter((row) => !row.noData)
    .flatMap((row) =>
      Object.values(row).filter((val) => typeof val === "number")
    );
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;

  const getColor = (value) => {
    if (!value) return "rgb(244, 245, 247)";
    const normalizedValue = max === min ? 0.5 : (value - min) / (max - min);
    return `rgba(242, 100, 50, ${0.3 + normalizedValue * 0.6})`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const getTimeOfDay = (hour) => {
    const hourNum = parseInt(hour);
    if (hourNum >= 5 && hourNum < 12) return "Morning (5:00–11:59)";
    if (hourNum >= 12 && hourNum < 17) return "Afternoon (12:00–16:59)";
    if (hourNum >= 17 && hourNum < 21) return "Evening (17:00–20:59)";
    return "Night (21:00–4:59)";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Ad Airtime Heatmap
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                Hourly ad duration across radio stations
              </CardDescription>
            </div>
          </div>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-56 bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div
              className="grid gap-px bg-gray-200"
              style={{
                gridTemplateColumns: "120px repeat(24, minmax(40px, 1fr))",
              }}
            >
              <div className="bg-gray-100 font-medium text-sm text-gray-700 p-3 rounded-tl-lg">
                Station
              </div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="bg-gray-100 p-2 text-center relative group"
                  onMouseEnter={() => setHoveredCell(hour)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div className="text-xs font-medium text-gray-600">
                    {hour}
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg max-w-[200px]">
                    <p className="font-semibold">{hour}</p>
                    <p>{getTimeOfDay(hour.split(":")[0])}</p>
                    <p className="text-xs text-gray-300">Date: {formatDate(selectedDate)}</p>
                  </div>
                </div>
              ))}
            </div>

            {matrix.map((row, idx) => (
              <div
                key={idx}
                className="grid gap-px bg-gray-200"
                style={{
                  gridTemplateColumns: "120px repeat(24, minmax(40px, 1fr))",
                }}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div
                  className={`p-3 font-medium text-sm text-gray-700 bg-gray-100 transition-colors h-12 flex items-center ${
                    hoveredRow === idx ? "text-primary font-semibold" : ""
                  }`}
                >
                  {row.station}
                </div>
                {row.noData ? (
                  <div
                    className="col-span-24 h-12 flex items-center justify-center bg-gray-100 text-sm text-gray-500 italic"
                    style={{ gridColumn: "2 / -1" }}
                  >
                    No data for this date for {row.station}
                  </div>
                ) : (
                  hours.map((hour) => (
                    <div
                      key={hour}
                      className="relative group"
                      style={{
                        backgroundColor: getColor(row[hour.split(":")[0]]),
                      }}
                    >
                      <div className="h-12 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-800">
                          {row[hour.split(":")[0]].toFixed(1)}
                        </span>
                      </div>
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg max-w-[200px]">
                        <p className="font-semibold">{row.station}</p>
                        <p>Time: {hour}</p>
                        <p>Duration: {row[hour.split(":")[0]].toFixed(1)} mins</p>
                        <p className="text-xs text-gray-300">Date: {formatDate(selectedDate)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-600">Ad Duration:</span>
              <div className="h-4 w-48 rounded-md bg-gradient-to-r from-[#F2643233] to-[#F26430]" />
              <span className="text-sm text-gray-600">Higher</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Hover for details</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 text-sm text-gray-500 border-t">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>24-hour ad airtime distribution by station</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RadioAdHeatmap;