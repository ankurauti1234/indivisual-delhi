"use client";

import { TrendingUp } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
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

// Sample data for station metrics by week
const battleCardData = {
  week16: {
    mangofm: {
      name: "Mango FM",
      data: {
        "Ad Load by Count": { value: 150, fullValue: 150 }, // 150 ads
        "Ad Load by Seconds": { value: 7200, fullValue: 7200 }, // 7200 seconds
        "Number of Advertisers": { value: 25, fullValue: 25 }, // 25 advertisers
      },
    },
    redfm: {
      name: "Red FM",
      data: {
        "Ad Load by Count": { value: 180, fullValue: 180 },
        "Ad Load by Seconds": { value: 9000, fullValue: 9000 },
        "Number of Advertisers": { value: 30, fullValue: 30 },
      },
    },
    clubfm: {
      name: "Club FM",
      data: {
        "Ad Load by Count": { value: 120, fullValue: 120 },
        "Ad Load by Seconds": { value: 6000, fullValue: 6000 },
        "Number of Advertisers": { value: 20, fullValue: 20 },
      },
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: {
        "Ad Load by Count": { value: 200, fullValue: 200 },
        "Ad Load by Seconds": { value: 9600, fullValue: 9600 },
        "Number of Advertisers": { value: 35, fullValue: 35 },
      },
    },
  },
  week17: {
    mangofm: {
      name: "Mango FM",
      data: {
        "Ad Load by Count": { value: 155, fullValue: 155 },
        "Ad Load by Seconds": { value: 7400, fullValue: 7400 },
        "Number of Advertisers": { value: 27, fullValue: 27 },
      },
    },
    redfm: {
      name: "Red FM",
      data: {
        "Ad Load by Count": { value: 185, fullValue: 185 },
        "Ad Load by Seconds": { value: 9200, fullValue: 9200 },
        "Number of Advertisers": { value: 32, fullValue: 32 },
      },
    },
    clubfm: {
      name: "Club FM",
      data: {
        "Ad Load by Count": { value: 125, fullValue: 125 },
        "Ad Load by Seconds": { value: 6200, fullValue: 6200 },
        "Number of Advertisers": { value: 22, fullValue: 22 },
      },
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: {
        "Ad Load by Count": { value: 210, fullValue: 210 },
        "Ad Load by Seconds": { value: 10000, fullValue: 10000 },
        "Number of Advertisers": { value: 38, fullValue: 38 },
      },
    },
  },
};

// Available stations
const stationOptions = [
  { value: "mangofm", label: "Mango FM" },
  { value: "redfm", label: "Red FM" },
  { value: "clubfm", label: "Club FM" },
  { value: "radiomirchi", label: "Radio Mirchi" },
];

// Chart configuration with distinct colors for each station
const chartConfig = {
  mangofm: { label: "Mango FM", color: "hsl(var(--chart-1))" }, // Blue
  redfm: { label: "Red FM", color: "hsl(var(--chart-2))" }, // Green
  clubfm: { label: "Club FM", color: "hsl(var(--chart-3))" }, // Yellow
  radiomirchi: { label: "Radio Mirchi", color: "hsl(var(--chart-4))" }, // Purple
};

export default function WhyUsBattleCards() {
  const [selectedStation, setSelectedStation] = useState("mangofm");
  const [selectedWeek, setSelectedWeek] = useState("week16");

  // Calculate max values for normalization based on selected week
  const currentWeekData = battleCardData[selectedWeek];
  const maxValues = {
    "Ad Load by Count": Math.max(...Object.values(currentWeekData).map(d => d.data["Ad Load by Count"].fullValue)),
    "Ad Load by Seconds": Math.max(...Object.values(currentWeekData).map(d => d.data["Ad Load by Seconds"].fullValue)),
    "Number of Advertisers": Math.max(...Object.values(currentWeekData).map(d => d.data["Number of Advertisers"].fullValue)),
  };

  // Prepare chart data based on selected week
  const chartData = [
    {
      metric: "Ad Load by Count",
      mangofm: (currentWeekData.mangofm.data["Ad Load by Count"].fullValue / maxValues["Ad Load by Count"]) * 100,
      redfm: (currentWeekData.redfm.data["Ad Load by Count"].fullValue / maxValues["Ad Load by Count"]) * 100,
      clubfm: (currentWeekData.clubfm.data["Ad Load by Count"].fullValue / maxValues["Ad Load by Count"]) * 100,
      radiomirchi: (currentWeekData.radiomirchi.data["Ad Load by Count"].fullValue / maxValues["Ad Load by Count"]) * 100,
      fullValues: {
        mangofm: currentWeekData.mangofm.data["Ad Load by Count"].fullValue,
        redfm: currentWeekData.redfm.data["Ad Load by Count"].fullValue,
        clubfm: currentWeekData.clubfm.data["Ad Load by Count"].fullValue,
        radiomirchi: currentWeekData.radiomirchi.data["Ad Load by Count"].fullValue,
      },
    },
    {
      metric: "Ad Load by Seconds",
      mangofm: (currentWeekData.mangofm.data["Ad Load by Seconds"].fullValue / maxValues["Ad Load by Seconds"]) * 100,
      redfm: (currentWeekData.redfm.data["Ad Load by Seconds"].fullValue / maxValues["Ad Load by Seconds"]) * 100,
      clubfm: (currentWeekData.clubfm.data["Ad Load by Seconds"].fullValue / maxValues["Ad Load by Seconds"]) * 100,
      radiomirchi: (currentWeekData.radiomirchi.data["Ad Load by Seconds"].fullValue / maxValues["Ad Load by Seconds"]) * 100,
      fullValues: {
        mangofm: currentWeekData.mangofm.data["Ad Load by Seconds"].fullValue,
        redfm: currentWeekData.redfm.data["Ad Load by Seconds"].fullValue,
        clubfm: currentWeekData.clubfm.data["Ad Load by Seconds"].fullValue,
        radiomirchi: currentWeekData.radiomirchi.data["Ad Load by Seconds"].fullValue,
      },
    },
    {
      metric: "Number of Advertisers",
      mangofm: (currentWeekData.mangofm.data["Number of Advertisers"].fullValue / maxValues["Number of Advertisers"]) * 100,
      redfm: (currentWeekData.redfm.data["Number of Advertisers"].fullValue / maxValues["Number of Advertisers"]) * 100,
      clubfm: (currentWeekData.clubfm.data["Number of Advertisers"].fullValue / maxValues["Number of Advertisers"]) * 100,
      radiomirchi: (currentWeekData.radiomirchi.data["Number of Advertisers"].fullValue / maxValues["Number of Advertisers"]) * 100,
      fullValues: {
        mangofm: currentWeekData.mangofm.data["Number of Advertisers"].fullValue,
        redfm: currentWeekData.redfm.data["Number of Advertisers"].fullValue,
        clubfm: currentWeekData.clubfm.data["Number of Advertisers"].fullValue,
        radiomirchi: currentWeekData.radiomirchi.data["Number of Advertisers"].fullValue,
      },
    },
  ];

  const formatValue = (value, metric) => {
    if (metric === "Ad Load by Count") return `${value} ads`;
    if (metric === "Ad Load by Seconds") return `${value} seconds`;
    return `${value} advertisers`;
  };

  const handleStationChange = (value) => {
    setSelectedStation(value);
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    // Reset station selection to default when week changes
    setSelectedStation("mangofm");
  };

  return (
    <ChartCard
      icon={<TrendingUp className="w-6 h-6" />}
      title='"Why Us?" Battle Cards'
      description={`Data-Backed Differentiators vs. Competitors - ${selectedWeek === "week16" ? "Week 16" : "Week 17"} 2024`}
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
          <RadarChart
            data={chartData}
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 16,
            }}
            height={400}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis domain={[0, 100]} tickCount={6} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label, payload) => payload[0]?.payload?.metric || ""}
                  valueFormatter={(value, name, props) => formatValue(props.payload.fullValues[name], props.payload.metric)}
                />
              }
            />
            <Legend />
            {stationOptions.map((station) => (
              <Radar
                key={station.value}
                name={station.label}
                dataKey={station.value}
                stroke={chartConfig[station.value].color}
                fill={chartConfig[station.value].color}
                fillOpacity={station.value === selectedStation ? 0.4 : 0.1}
                strokeOpacity={station.value === selectedStation ? 1 : 0.5}
              />
            ))}
          </RadarChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Comparing strengths for {currentWeekData[selectedStation].name} against competitors in {selectedWeek === "week16" ? "Week 16" : "Week 17"}
        </p>
      }
    />
  );
}