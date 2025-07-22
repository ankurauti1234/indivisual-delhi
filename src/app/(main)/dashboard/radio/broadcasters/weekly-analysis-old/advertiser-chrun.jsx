"use client";

import { AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Cell } from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { week16, week17 } from "./top-ad-data"; // Import the JSON data

// Derive churn data from week16 and week17
const deriveChurnData = () => {
  const stations = ["mangofm", "redfm", "clubfm", "radiomirchi"];
  const stationNames = {
    mangofm: "Mango FM",
    redfm: "Red FM",
    clubfm: "Club FM",
    radiomirchi: "Radio Mirchi",
  };
  const stationKeys = {
    mangofm: "Mango FM",
    redfm: "Red FM",
    clubfm: "Club FM",
    radiomirchi: "Radio Mirchi",
  };

  const getAdvertisers = (weekData, stationKey) =>
    new Set(
      weekData
        .filter((item) => (item[stationKey] || 0) > 0)
        .map((item) => item.Brand)
    );

  const churnData = {
    week16: {},
    week17: {},
  };

  stations.forEach((station) => {
    // Week 16: Use week17 as "previous" week for initial/dropped
    const week16Advertisers = getAdvertisers(week16, stationKeys[station]);
    const week17Advertisers = getAdvertisers(week17, stationKeys[station]);

    // Week 16 churn (assuming week17 as prior week for initial)
    const week16New = [...week16Advertisers].filter(
      (brand) => !week17Advertisers.has(brand)
    );
    const week16Dropped = [...week17Advertisers].filter(
      (brand) => !week16Advertisers.has(brand)
    );

    churnData.week16[station] = {
      name: stationNames[station],
      data: [
        { metric: "Initial", count: week17Advertisers.size },
        { metric: "New", count: week16New.length },
        { metric: "Dropped", count: -week16Dropped.length },
        { metric: "Final", count: week16Advertisers.size },
      ],
    };

    // Week 17 churn (using week16 as prior week)
    const week17New = [...week17Advertisers].filter(
      (brand) => !week16Advertisers.has(brand)
    );
    const week17Dropped = [...week16Advertisers].filter(
      (brand) => !week17Advertisers.has(brand)
    );

    churnData.week17[station] = {
      name: stationNames[station],
      data: [
        { metric: "Initial", count: week16Advertisers.size },
        { metric: "New", count: week17New.length },
        { metric: "Dropped", count: -week17Dropped.length },
        { metric: "Final", count: week17Advertisers.size },
      ],
    };
  });

  return churnData;
};

// Prepare churn data
const churnData = deriveChurnData();

// Available stations
const stationOptions = [
  { value: "mangofm", label: "Mango FM" },
  { value: "redfm", label: "Red FM" },
  { value: "clubfm", label: "Club FM" },
  { value: "radiomirchi", label: "Radio Mirchi" },
];

// Chart configuration with different colors for each metric
const chartConfig = {
  Initial: { label: "Initial Advertisers", color: "hsl(var(--chart-1))" }, // Blue
  New: { label: "New Advertisers", color: "hsl(var(--chart-2))" }, // Green
  Dropped: { label: "Dropped Advertisers", color: "#ff0000" }, // Red
  Final: { label: "Final Advertisers", color: "hsl(var(--chart-4))" }, // Purple
};

export default function AdvertiserChurn() {
  const [selectedStation, setSelectedStation] = useState("mangofm");
  const [selectedWeek, setSelectedWeek] = useState("week16");

  // Get data for the selected station and week
  const chartData = churnData[selectedWeek][selectedStation].data;

  const formatNumber = (value) => {
    return `${Math.abs(value)}`;
  };

  const handleStationChange = (value) => {
    setSelectedStation(value);
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  return (
    <ChartCard
      icon={<AlertTriangle className="w-6 h-6" />}
      title="Advertiser Churn"
      description={`Brands That Stopped or Started Advertising - ${
        selectedWeek === "week16" ? "Week 16" : "Week 17"
      } (2024)`}
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} defaultValue="week16">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">Week 16</SelectItem>
              <SelectItem value="week17">Week 17</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleStationChange} defaultValue="mangofm">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 16,
            }}
            height={300}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="metric"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              tickFormatter={formatNumber}
              domain={[-10, "auto"]} // Ensure negative values are visible
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Metric: ${label}`}
                  valueFormatter={(value) => `${Math.abs(value)} advertisers`}
                />
              }
            />
            <Legend />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig[entry.metric].color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing advertiser churn for {churnData[selectedWeek][selectedStation].name} in {selectedWeek === "week16" ? "Week 16" : "Week 17"}
        </p>
      }
    />
  );
}