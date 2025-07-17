"use client";

import { BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Sample data with dates
const dailyAdData = {
  week16: {
    clubfm: {
      name: "Club FM",
      data: [
        { date: "17 Apr", day: "Thu", count: 440, seconds: 8702 },
        { date: "18 Apr", day: "Fri", count: 407, seconds: 8452 },
        { date: "19 Apr", day: "Sat", count: 483, seconds: 11049 },
        { date: "20 Apr", day: "Sun", count: 427, seconds: 7477 },
        { date: "21 Apr", day: "Mon", count: 281, seconds: 6556 },
        { date: "22 Apr", day: "Tue", count: 262, seconds: 6004 },
        { date: "23 Apr", day: "Wed", count: 387, seconds: 8326 },
      ],
    },
    mangofm: {
      name: "Mango FM",
      data: [
        { date: "17 Apr", day: "Thu", count: 461, seconds: 10111 },
        { date: "18 Apr", day: "Fri", count: 479, seconds: 10344 },
        { date: "19 Apr", day: "Sat", count: 353, seconds: 7151 },
        { date: "20 Apr", day: "Sun", count: 293, seconds: 5698 },
        { date: "21 Apr", day: "Mon", count: 280, seconds: 6167 },
        { date: "22 Apr", day: "Tue", count: 286, seconds: 6207 },
        { date: "23 Apr", day: "Wed", count: 353, seconds: 7110 },
      ],
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: [
        { date: "17 Apr", day: "Thu", count: 347, seconds: 6472 },
        { date: "18 Apr", day: "Fri", count: 355, seconds: 6162 },
        { date: "19 Apr", day: "Sat", count: 351, seconds: 5767 },
        { date: "20 Apr", day: "Sun", count: 220, seconds: 4948 },
        { date: "21 Apr", day: "Mon", count: 0, seconds: 0 },
        { date: "22 Apr", day: "Tue", count: 250, seconds: 4176 },
        { date: "23 Apr", day: "Wed", count: 287, seconds: 5060 },
      ],
    },
    redfm: {
      name: "Red FM",
      data: [
        { date: "17 Apr", day: "Thu", count: 1112, seconds: 15172 },
        { date: "18 Apr", day: "Fri", count: 1011, seconds: 12686 },
        { date: "19 Apr", day: "Sat", count: 929, seconds: 12163 },
        { date: "20 Apr", day: "Sun", count: 813, seconds: 11136 },
        { date: "21 Apr", day: "Mon", count: 896, seconds: 11833 },
        { date: "22 Apr", day: "Tue", count: 905, seconds: 11264 },
        { date: "23 Apr", day: "Wed", count: 956, seconds: 12611 },
      ],
    },
  },
  week17: {
    clubfm: {
      name: "Club FM",
      data: [
        { date: "24 Apr", day: "Thu", count: 383, seconds: 7090 },
        { date: "25 Apr", day: "Fri", count: 298, seconds: 6123 },
        { date: "26 Apr", day: "Sat", count: 309, seconds: 6444 },
        { date: "27 Apr", day: "Sun", count: 0, seconds: 0 },
        { date: "28 Apr", day: "Mon", count: 282, seconds: 6076 },
        { date: "29 Apr", day: "Tue", count: 326, seconds: 7370 },
        { date: "30 Apr", day: "Wed", count: 350, seconds: 8200 },
      ],
    },
    mangofm: {
      name: "Mango FM",
      data: [
        { date: "24 Apr", day: "Thu", count: 412, seconds: 8221 },
        { date: "25 Apr", day: "Fri", count: 299, seconds: 5658 },
        { date: "26 Apr", day: "Sat", count: 192, seconds: 3501 },
        { date: "27 Apr", day: "Sun", count: 271, seconds: 5050 },
        { date: "28 Apr", day: "Mon", count: 274, seconds: 4970 },
        { date: "29 Apr", day: "Tue", count: 300, seconds: 5884 },
        { date: "30 Apr", day: "Wed", count: 316, seconds: 6386 },
      ],
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: [
        { date: "24 Apr", day: "Thu", count: 251, seconds: 3894 },
        { date: "25 Apr", day: "Fri", count: 242, seconds: 3741 },
        { date: "26 Apr", day: "Sat", count: 213, seconds: 2851 },
        { date: "27 Apr", day: "Sun", count: 0, seconds: 0 },
        { date: "28 Apr", day: "Mon", count: 265, seconds: 4378 },
        { date: "29 Apr", day: "Tue", count: 0, seconds: 0 },
        { date: "30 Apr", day: "Wed", count: 0, seconds: 0 },
      ],
    },
    redfm: {
      name: "Red FM",
      data: [
        { date: "24 Apr", day: "Thu", count: 928, seconds: 11535 },
        { date: "25 Apr", day: "Fri", count: 767, seconds: 9612 },
        { date: "26 Apr", day: "Sat", count: 737, seconds: 7603 },
        { date: "27 Apr", day: "Sun", count: 531, seconds: 6662 },
        { date: "28 Apr", day: "Mon", count: 771, seconds: 8704 },
        { date: "29 Apr", day: "Tue", count: 843, seconds: 10893 },
        { date: "30 Apr", day: "Wed", count: 891, seconds: 12039 },
      ],
    },
  },
};

// List of stations
const stations = ["mangofm", "redfm", "clubfm", "radiomirchi"];

// Chart configuration
const chartConfig = {
  mangofm: { label: "Mango FM", color: "hsl(var(--chart-1))" },
  redfm: { label: "Red FM", color: "hsl(var(--chart-2))" },
  clubfm: { label: "Club FM", color: "hsl(var(--chart-3))" },
  radiomirchi: { label: "Radio Mirchi", color: "hsl(var(--chart-4))" },
};

export default function DailyAdCount() {
  const [selectedStation, setSelectedStation] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [showSeconds, setShowSeconds] = useState(false);

  // Get the date order for the selected week
  const dateOrder = dailyAdData[selectedWeek].clubfm.data.map(item => item.date);

  // Prepare data for bar chart
  const chartData = dateOrder.map(date => {
    const baseData = { date };
    
    if (selectedStation === "all") {
      stations.forEach(station => {
        const dayData = dailyAdData[selectedWeek][station].data.find(d => d.date === date);
        baseData[station] = dayData ? dayData[showSeconds ? "seconds" : "count"] : 0;
      });
    } else {
      const dayData = dailyAdData[selectedWeek][selectedStation].data.find(d => d.date === date);
      baseData.count = dayData ? dayData[showSeconds ? "seconds" : "count"] : 0;
    }
    
    return baseData;
  });

  const formatValue = (value) => {
    return Math.round(value).toLocaleString() + (showSeconds ? "s" : "");
  };

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title={showSeconds ? "Daily Ad Duration" : "Daily Ad Count"}
      description={`${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"} per Day - ${
        selectedWeek === "week16" ? "17-23 Apr 2024" : "24-30 Apr 2024"
      }`}
      action={
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch id="unit-toggle" checked={showSeconds} onCheckedChange={setShowSeconds} />
            <Label htmlFor="unit-toggle">{showSeconds ? "Seconds" : "Counts"}</Label>
          </div>
          <Select onValueChange={setSelectedWeek} defaultValue="week16">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">17-23 Apr</SelectItem>
              <SelectItem value="week17">24-30 Apr</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedStation} defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {stations.map((station) => (
                <SelectItem key={station} value={station}>
                  {dailyAdData[selectedWeek][station].name}
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
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={6} tickFormatter={formatValue} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  valueFormatter={formatValue}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value, name, props) => {
                    if (selectedStation === "all") {
                      const stationLabel = chartConfig[name]?.label || name;
                      return [
                        `${formatValue(value)} ${showSeconds ? "seconds" : "ads"}`,
                        stationLabel
                      ];
                    } else {
                      const stationLabel = dailyAdData[selectedWeek][selectedStation].name;
                      return [
                        `${formatValue(value)} ${showSeconds ? "seconds" : "ads"}`,
                        stationLabel
                      ];
                    }
                  }}
                />
              }
            />
            <Legend />
            {selectedStation === "all" ? (
              stations.map((station, index) => (
                <Bar
                  key={station}
                  dataKey={station}
                  fill={chartConfig[station].color}
                  name={chartConfig[station].label}
                  stackId="a"
                  radius={index === stations.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))
            ) : (
              <Bar
                dataKey="count"
                fill={chartConfig[selectedStation].color}
                name={chartConfig[selectedStation].label}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing {showSeconds ? "total ad duration" : "total ad counts"} per day for{" "}
          {selectedStation === "all" ? "all stations" : dailyAdData[selectedWeek][selectedStation].name} in{" "}
          {selectedWeek === "week16" ? "17-23 Apr 2024" : "24-30 Apr 2024"}
        </p>
      }
    />
  );
}