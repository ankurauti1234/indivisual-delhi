'use client'
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, LabelList } from "recharts"; // Add LabelList to imports
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";
import MultipleSelector from "@/components/ui/multiselect";
import { Separator } from "@/components/ui/separator";

export const description =
  "A line chart showing daily ad trends by station with multi-week and station selection";

const AdDailyTrendsLine = ({ data }) => {
  const [selectedWeeks, setSelectedWeeks] = useState([
    { value: data.weeks[0]?.week || "", label: data.weeks[0]?.week || "" },
  ]);
  const [selectedStations, setSelectedStations] = useState([
    { value: "all", label: "All Stations" },
  ]);
  const [showAirtime, setShowAirtime] = useState(false);

  // Derive unique stations and dates
  const allStations = data.stations.map((s) => s.name) || [];
  const weekOptions = data.weeks.map((week) => ({
    value: week.week,
    label: week.week,
  }));
  const stationOptions = [
    { value: "all", label: "All Stations" },
    ...allStations.map((station) => ({ value: station, label: station })),
  ];

  // Handle week selection
  const handleWeekChange = (weeks) => {
    setSelectedWeeks(weeks.length > 0 ? weeks : [{ value: data.weeks[0].week, label: data.weeks[0].week }]);
  };

  // Handle station selection
  const handleStationChange = (stations) => {
    setSelectedStations(stations.length > 0 ? stations : [{ value: "all", label: "All Stations" }]);
  };

  // Prepare chart data
  const stations = selectedStations.some((s) => s.value === "all")
    ? allStations
    : selectedStations.map((s) => s.value);
  const chartData = selectedWeeks
    .flatMap((week) => {
      const weekData = data.weeks.find((w) => w.week === week.value);
      return weekData?.data || [];
    })
    .reduce((acc, dateData) => {
      if (!acc[dateData.date]) {
        acc[dateData.date] = { date: dateData.date, day: dateData.day };
        stations.forEach((station) => {
          acc[dateData.date][station] = 0;
        });
      }
      dateData.stations.forEach((stationData) => {
        if (stations.includes(stationData.station)) {
          acc[dateData.date][stationData.station] = showAirtime
            ? stationData.airtime
            : stationData.adCount;
        }
      });
      return acc;
    }, {});
  const formattedChartData = Object.values(chartData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Chart configuration
  const chartConfig = data.stations.reduce((config, station) => {
    config[station.name] = {
      label: station.name,
      color: station.color,
    };
    return config;
  }, {});

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Daily Ad Trends by Station</CardTitle>
          <CardDescription>
            {showAirtime ? "Ad airtime (seconds)" : "Ad spots"} for{" "}
            {selectedWeeks.map((w) => w.label).join(", ")}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <MultipleSelector
            value={selectedWeeks}
            onChange={handleWeekChange}
            defaultOptions={weekOptions}
            placeholder="Select weeks"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No weeks found</p>
            }
            className="max-w-64 w-full"
          />
          <MultipleSelector
            value={selectedStations}
            onChange={handleStationChange}
            defaultOptions={stationOptions}
            placeholder="Select stations"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No stations found</p>
            }
            className="max-w-64 w-full"
          />
          <Toggle
            pressed={showAirtime}
            onPressedChange={setShowAirtime}
            className="w-full"
          >
            {showAirtime ? "Show Ad spots" : "Show Airtime (s)"}
          </Toggle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={formattedChartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => {
                const entry = formattedChartData.find((d) => d.date === value);
                const day = entry?.day?.slice(0, 3) || "";
                const date = value.slice(5); // "MM-DD"
                return `${date}\n${day}`; // This will be split manually below
              }}
              tick={({ x, y, payload }) => {
                const entry = formattedChartData.find(
                  (d) => d.date === payload.value
                );
                const day = entry?.day?.slice(0, 3) || "";
                const date = payload.value.slice(5); // MM-DD

                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    <text textAnchor="middle" fill="#666" fontSize="12">
                      <tspan x="0" dy="-0.4em">
                        {date}
                      </tspan>
                      <tspan x="0" dy="1.2em">
                        {day}
                      </tspan>
                    </text>
                  </g>
                );
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: showAirtime ? "Airtime (seconds)" : "Ad Count",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip cursor={false} />
            {stations.map((station) => (
              <Line
                key={station}
                dataKey={station}
                type="monotone"
                stroke={chartConfig[station]?.color || "#8884d8"}
                strokeWidth={2}
                dot={{
                  fill: chartConfig[station]?.color || "#8884d8",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  dataKey={station}
                  position="top"
                  style={{
                    fontSize: "12px",
                    fill: chartConfig[station]?.color || "#8884d8",
                  }}
                  formatter={(value) => (value !== 0 ? value : "")} // Only show non-zero values
                />
              </Line>
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <div className="flex flex-wrap gap-2">
          {data.stations.map((station) => (
            <div
              key={station.name}
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: station.color }}
            >
              {station.name}
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdDailyTrendsLine;