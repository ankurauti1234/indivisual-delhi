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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { Checkbox } from "@/components/ui/checkbox";
import { week19, week20 } from "./top-ad-data";

// Derive shared advertiser data from week19 and week20
const deriveSharedAdvertiserData = (weekData) => {
  const brands = new Set(weekData.map((item) => item.Brand));
  const sharedData = {};

  brands.forEach((brand) => {
    const brandData = weekData.find((item) => item.Brand === brand);
    const stations = [
      { name: "Radio City", key: "Radio City" },
      { name: "Red FM", key: "Red FM" },
      { name: "Big FM", key: "Big FM" },
      { name: "Radio Mirchi", key: "Radio Mirchi" },
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
          ? Number(((brandData[station.key] || 0) / totalSpend * 100).toFixed(2))
          : 0,
    })),
  };
}

  });

  return sharedData;
};

// Prepare shared advertiser data
const sharedAdvertiserData = {
  week19: deriveSharedAdvertiserData(week19),
  week20: deriveSharedAdvertiserData(week20),
};

// List of major advertisers (brands advertising on at least two stations)
const majorAdvertisers = Object.keys(sharedAdvertiserData.week19).filter(
  (brand) => brand in sharedAdvertiserData.week20
);

// Chart configuration with distinct colors for each station
const chartConfig = {
  radiocity: { label: "Radio City", color: "hsl(var(--chart-1))" }, // Blue
  redfm: { label: "Red FM", color: "hsl(var(--chart-2))" }, // Green
  bigfm: { label: "Big FM", color: "hsl(var(--chart-3))" }, // Yellow
  radiomirchi: { label: "Radio Mirchi", color: "hsl(var(--chart-4))" }, // Purple
};

export default function SharedAdvertisers() {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState(majorAdvertisers);
  const [selectedWeek, setSelectedWeek] = useState("week19");

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
  const isAllSelected = selectedAdvertisers.length === majorAdvertisers.length;
  const dynamicBarSize = isAllSelected
    ? Math.max(60, 800 / (chartData.length || 1)) // Increase bar size when all selected
    : Math.max(40, 600 / (chartData.length || 1));

  // Truncate and format Y-axis labels
  const truncateLabel = (value) => {
    const maxLength = 15; // Adjust as needed
    const label = sharedAdvertiserData[selectedWeek][value].name;
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  // Custom tooltip formatter to hide stations with 0% share
  const customTooltipFormatter = (value, name, props) => {
    if (value === 0) return null; // Skip stations with 0% share
    return [formatPercentage(value), `Station: ${chartConfig[name]?.label || name}`];
  };

  return (
    <ChartCard
      icon={<Users className="w-6 h-6" />}
      title="Shared Advertisers"
      description={`Advertisers Running Spots Across Multiple Stations (2024) - ${
        selectedWeek === "week19" ? "Week 19" : "Week 20"
      }`}
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} defaultValue="week19">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week19">Week 19</SelectItem>
              <SelectItem value="week20">Week 20</SelectItem>
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
        <ChartContainer config={chartConfig} className="min-h-64 h-[800px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 16,
              right: 16,
              bottom: 16,
              left: 16,
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
                  formatter={customTooltipFormatter}
                  filterNull={true} // Ensure null values are filtered out
                />
              }
            />
            <Legend />
            <Bar
              dataKey="radiocity"
              stackId="a"
              fill={chartConfig.radiocity.color}
              name={chartConfig.radiocity.label}
              barSize={dynamicBarSize}
              hide={chartData.every((data) => data.radiocity === 0)}
            >
              <LabelList
                dataKey="radiocity"
                position="center"
                formatter={formatPercentage}
                fill="#fff"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="redfm"
              stackId="a"
              fill={chartConfig.redfm.color}
              name={chartConfig.redfm.label}
              barSize={dynamicBarSize}
              hide={chartData.every((data) => data.redfm === 0)}
            >
              <LabelList
                dataKey="redfm"
                position="center"
                formatter={formatPercentage}
                fill="#fff"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="bigfm"
              stackId="a"
              fill={chartConfig.bigfm.color}
              name={chartConfig.bigfm.label}
              barSize={dynamicBarSize}
              hide={chartData.every((data) => data.bigfm === 0)}
            >
              <LabelList
                dataKey="bigfm"
                position="center"
                formatter={formatPercentage}
                fill="#fff"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="radiomirchi"
              stackId="a"
              fill={chartConfig.radiomirchi.color}
              name={chartConfig.radiomirchi.label}
              barSize={dynamicBarSize}
              hide={chartData.every((data) => data.radiomirchi === 0)}
            >
              <LabelList
                dataKey="radiomirchi"
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
          in {selectedWeek === "week19" ? "Week 19" : "Week 20"}
        </p>
      }
    />
  );
}