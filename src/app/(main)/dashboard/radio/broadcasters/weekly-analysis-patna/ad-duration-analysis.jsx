"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Pie, PieChart, Legend } from "recharts";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

// Sample data for ad durations and top advertisers across stations and weeks
const durationData = {
  week16: {
    mangofm: {
      name: "Mango FM",
      data: [
        {
          duration: "15s",
          value: 40,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandA", "BrandB", "BrandC"],
        },
        {
          duration: "30s",
          value: 35,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandD", "BrandE", "BrandF"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandG", "BrandH", "BrandI"],
        },
      ],
    },
    redfm: {
      name: "Red FM",
      data: [
        {
          duration: "15s",
          value: 45,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandA", "BrandC", "BrandJ"],
        },
        {
          duration: "30s",
          value: 30,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandB", "BrandE", "BrandG"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandF", "BrandH", "BrandI"],
        },
      ],
    },
    clubfm: {
      name: "Club FM",
      data: [
        {
          duration: "15s",
          value: 50,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandB", "BrandD", "BrandI"],
        },
        {
          duration: "30s",
          value: 30,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandA", "BrandC", "BrandF"],
        },
        {
          duration: "60s",
          value: 20,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandE", "BrandG", "BrandJ"],
        },
      ],
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: [
        {
          duration: "15s",
          value: 35,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandA", "BrandE", "BrandH"],
        },
        {
          duration: "30s",
          value: 40,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandB", "BrandD", "BrandI"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandC", "BrandF", "BrandJ"],
        },
      ],
    },
  },
  week17: {
    mangofm: {
      name: "Mango FM",
      data: [
        {
          duration: "15s",
          value: 42,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandB", "BrandA", "BrandD"],
        },
        {
          duration: "30s",
          value: 33,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandE", "BrandF", "BrandC"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandH", "BrandI", "BrandG"],
        },
      ],
    },
    redfm: {
      name: "Red FM",
      data: [
        {
          duration: "15s",
          value: 47,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandC", "BrandJ", "BrandA"],
        },
        {
          duration: "30s",
          value: 28,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandE", "BrandG", "BrandB"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandH", "BrandI", "BrandF"],
        },
      ],
    },
    clubfm: {
      name: "Club FM",
      data: [
        {
          duration: "15s",
          value: 52,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandD", "BrandI", "BrandB"],
        },
        {
          duration: "30s",
          value: 28,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandC", "BrandF", "BrandA"],
        },
        {
          duration: "60s",
          value: 20,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandG", "BrandJ", "BrandE"],
        },
      ],
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: [
        {
          duration: "15s",
          value: 37,
          fill: "hsl(var(--chart-1))",
          topAdvertisers: ["BrandE", "BrandH", "BrandA"],
        },
        {
          duration: "30s",
          value: 38,
          fill: "hsl(var(--chart-2))",
          topAdvertisers: ["BrandD", "BrandI", "BrandB"],
        },
        {
          duration: "60s",
          value: 25,
          fill: "hsl(var(--chart-3))",
          topAdvertisers: ["BrandF", "BrandJ", "BrandC"],
        },
      ],
    },
  },
};

const chartConfig = {
  "15s": {
    label: "15s Ads",
    color: "hsl(var(--chart-1))",
  },
  "30s": {
    label: "30s Ads",
    color: "hsl(var(--chart-2))",
  },
  "60s": {
    label: "60s Ads",
    color: "hsl(var(--chart-3))",
  },
  mangofm: {
    label: "Mango FM",
  },
  redfm: {
    label: "Red FM",
  },
  clubfm: {
    label: "Club FM",
  },
  radiomirchi: {
    label: "Radio Mirchi",
  },
};

export default function AdDurationAnalysis() {
  const [selectedStation, setSelectedStation] = useState("mangofm");
  const [selectedWeek, setSelectedWeek] = useState("week16");

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Prepare data for pie chart (use selected station or aggregate for 'all')
  const chartData = selectedStation === "all"
    ? [
        {
          duration: "15s",
          value: Object.values(durationData[selectedWeek]).reduce(
            (sum, station) =>
              sum + station.data.find((d) => d.duration === "15s").value,
            0
          ) / Object.keys(durationData[selectedWeek]).length,
          fill: chartConfig["15s"].color,
          topAdvertisers: [
            ...new Set(
              Object.values(durationData[selectedWeek])
                .flatMap((station) =>
                  station.data.find((d) => d.duration === "15s").topAdvertisers
                )
                .slice(0, 3)
            ),
          ],
        },
        {
          duration: "30s",
          value: Object.values(durationData[selectedWeek]).reduce(
            (sum, station) =>
              sum + station.data.find((d) => d.duration === "30s").value,
            0
          ) / Object.keys(durationData[selectedWeek]).length,
          fill: chartConfig["30s"].color,
          topAdvertisers: [
            ...new Set(
              Object.values(durationData[selectedWeek])
                .flatMap((station) =>
                  station.data.find((d) => d.duration === "30s").topAdvertisers
                )
                .slice(0, 3)
            ),
          ],
        },
        {
          duration: "60s",
          value: Object.values(durationData[selectedWeek]).reduce(
            (sum, station) =>
              sum + station.data.find((d) => d.duration === "60s").value,
            0
          ) / Object.keys(durationData[selectedWeek]).length,
          fill: chartConfig["60s"].color,
          topAdvertisers: [
            ...new Set(
              Object.values(durationData[selectedWeek])
                .flatMap((station) =>
                  station.data.find((d) => d.duration === "60s").topAdvertisers
                )
                .slice(0, 3)
            ),
          ],
        },
      ]
    : durationData[selectedWeek][selectedStation].data;

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Ad Duration Analysis"
      description={`Who’s Running Longer Spots? 2024 - ${selectedWeek === "week16" ? "Week 16" : "Week 17"}`}
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={setSelectedWeek} defaultValue="week16">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">Week 16</SelectItem>
              <SelectItem value="week17">Week 17</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={setSelectedStation}
            defaultValue="mangofm"
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              <SelectItem value="mangofm">Mango FM</SelectItem>
              <SelectItem value="redfm">Red FM</SelectItem>
              <SelectItem value="clubfm">Club FM</SelectItem>
              <SelectItem value="radiomirchi">Radio Mirchi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig}  className="h-96 w-full">
          <PieChart
            accessibilityLayer
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 16,
            }}
            height={200}
          >
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="duration"
              cx="50%"
              cy="50%"
              outerRadius={160}
              label={({ name }) => chartConfig[name]?.label}
              labelLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => [
                    formatPercentage(value),
                    `Top Advertisers: ${props.payload.topAdvertisers.join(", ")}`,
                  ]}
                />
              }
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad duration distribution for{" "}
          {selectedStation === "all"
            ? "all stations"
            : durationData[selectedWeek][selectedStation].name} in {selectedWeek === "week16" ? "Week 16" : "Week 17"}
        </p>
      }
    />
  );
}