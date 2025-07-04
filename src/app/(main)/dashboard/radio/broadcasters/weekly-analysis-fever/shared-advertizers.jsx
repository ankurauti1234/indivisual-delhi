"use client";

import { Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, LabelList } from "recharts";
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
import { Checkbox } from "@/components/ui/checkbox";
import { week25 } from "./top-ad-data";

// Derive shared advertiser data from week25
const deriveSharedAdvertiserData = (weekData) => {
  const brands = new Set(weekData.map((item) => item.Brand));
  const sharedData = {};

  brands.forEach((brand) => {
    const brandData = weekData.find((item) => item.Brand === brand);
    const stations = [
      { name: "Fever FM", key: "Fever FM" }
    ];

    // Calculate total spend across all stations
    const totalSpend = stations.reduce(
      (sum, station) => sum + (brandData[station.key] || 0),
      0
    );

    // Only include brands with spend on at least two stations
    const activeStations = stations.filter(
      (station) => (brandData[station.key] || 0) > 0
    ).length;

    if (activeStations >= 2 && totalSpend > 0) {
      sharedData[brand] = {
        name: brand,
        data: stations.map((station) => ({
          station: station.name,
          percentage:
            totalSpend > 0
              ? Math.round(((brandData[station.key] || 0) / totalSpend) * 100)
              : 0,
        })),
      };
    }
  });

  return sharedData;
};

// Prepare shared advertiser data
const sharedAdvertiserData = {
  week25: deriveSharedAdvertiserData(week25),
};

// List of major advertisers (brands advertising on at least two stations)
const majorAdvertisers = Object.keys(sharedAdvertiserData.week25);

// Chart configuration with distinct colors for each station
const chartConfig = {
  feverfm: { label: "Fever FM", color: "hsl(var(--chart-1))" }, // Blue
};

export default function SharedAdvertisers() {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState(majorAdvertisers);
  const [selectedWeek, setSelectedWeek] = useState("week25");

  // Prepare data for horizontal stacked chart
  const chartData = majorAdvertisers
    .filter((adv) => selectedAdvertisers.includes(adv))
    .map((adv) => ({
      advertiser: adv,
      ...Object.fromEntries(
        sharedAdvertiserData[selectedWeek][adv].data.map((d) => [
          d.station.toLowerCase().replace(" ", ""),
          d.percentage,
        ])
      ),
    }));

  const formatPercentage = (value) => {
    return value > 0 ? `${value}%` : null; // Return null for 0% to hide label
  };

  const handleAdvertiserChange = (advertiser) => {
    setSelectedAdvertisers((prev) => {
      if (prev.includes(advertiser)) {
        return prev.filter((adv) => adv !== advertiser);
      } else {
        return [...prev, advertiser];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedAdvertisers(majorAdvertisers);
  };

  const handleClearAll = () => {
    setSelectedAdvertisers([]);
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  // Calculate dynamic bar size based on number of selected advertisers
  const dynamicBarSize = Math.max(40, 600 / (chartData.length || 1));

  // Truncate and format Y-axis labels
  const truncateLabel = (value) => {
    const maxLength = 15; // Adjust as needed
    const label = sharedAdvertiserData[selectedWeek][value].name;
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  return (
    <ChartCard
      icon={<Users className="w-6 h-6" />}
      title="Shared Advertisers"
      description="Advertisers Running Spots Across Multiple Stations - Week 25 (June 16-22, 2025)"
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} value="week25">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week25">Week 25</SelectItem>
            </SelectContent>
          </Select>
          <Select value="">
            <SelectTrigger className="w-48">
              <SelectValue 
                placeholder={
                  selectedAdvertisers.length === majorAdvertisers.length
                    ? "All Advertisers"
                    : selectedAdvertisers.length === 0
                    ? "Select Advertisers"
                    : `${selectedAdvertisers.length} Advertiser${selectedAdvertisers.length > 1 ? 's' : ''} Selected`
                }
              />
            </SelectTrigger>
            <SelectContent>
              <div className="flex justify-between px-2 py-1">
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={handleClearAll}
                >
                  Clear
                </button>
              </div>
              {majorAdvertisers.map((adv) => (
                <div key={adv} className="flex items-center px-2 py-1">
                  <Checkbox
                    checked={selectedAdvertisers.includes(adv)}
                    onCheckedChange={() => handleAdvertiserChange(adv)}
                    id={adv}
                  />
                  <label htmlFor={adv} className="ml-2 text-sm">
                    {sharedAdvertiserData[selectedWeek][adv].name}
                  </label>
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig} className="min-h-64 h-[600px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 100,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="advertiser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={truncateLabel}
              width={90}
              tick={{ fontSize: 10 }}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              tickFormatter={formatPercentage}
              domain={[0, 100]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  valueFormatter={formatPercentage}
                  formatter={(value, name) => [
                    formatPercentage(value),
                    `Station: ${chartConfig[name]?.label || name}`,
                  ]}
                />
              }
            />
            <Legend />
            <Bar
              dataKey="feverfm"
              stackId="a"
              fill={chartConfig.feverfm.color}
              name={chartConfig.feverfm.label}
              barSize={dynamicBarSize}
              hide={chartData.every((data) => data.feverfm === 0)}
            >
              <LabelList 
                dataKey="feverfm" 
                position="center" 
                formatter={formatPercentage}
                fill="#fff"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad spend distribution for{" "}
          {selectedAdvertisers.length === majorAdvertisers.length
            ? "all shared advertisers"
            : selectedAdvertisers.length === 0
            ? "no advertisers"
            : selectedAdvertisers
                .map((a) => sharedAdvertiserData[selectedWeek][a].name)
                .join(", ")}{" "}
          in Week 25
        </p>
      }
    />
  );
}