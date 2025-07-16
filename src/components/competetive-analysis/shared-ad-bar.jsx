/* shared-ad-bar.jsx */
"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector from "@/components/ui/multiselect";

export const description =
  "A horizontal stacked bar chart showing the percentage distribution of shared ads across stations";

const SharedAdBar = ({ data }) => {
  // Calculate top 5 ads by total adCount
  const topAds = useMemo(() => {
    const adTotals = {};
    data.data.forEach((item) => {
      const totalCount = item.stations.reduce((sum, s) => sum + s.adCount, 0);
      adTotals[item.adName] = (adTotals[item.adName] || 0) + totalCount;
    });
    return Object.entries(adTotals)
      .sort(([, a], [, b]) => b - a) // Sort by total count descending
      .slice(0, 5) // Take top 5
      .map(([adName]) => ({
        value: adName,
        label: adName,
      }));
  }, [data]);

  const [selectedWeek, setSelectedWeek] = useState(data.weeks[0] || "");
  const [selectedAds, setSelectedAds] = useState(topAds); // Initialize with top 5 ads

  // Derive options
  const weekOptions = data.weeks.map((week) => ({
    value: week,
    label: week,
  }));

  const adOptions = useMemo(() => {
    const ads = new Set();
    data.data.forEach((item) => ads.add(item.adName));
    return Array.from(ads).map((ad) => ({
      value: ad,
      label: ad,
    }));
  }, [data]);

  // Filter and transform data for Recharts
  const chartData = useMemo(() => {
    const filteredData = data.data.filter(
      (item) =>
        item.week === selectedWeek &&
        (selectedAds.length === 0 || selectedAds.some((ad) => ad.value === item.adName))
    );

    return filteredData.map((item) => {
      const totalCount = item.stations.reduce((sum, s) => sum + s.adCount, 0);
      const result = { adName: item.adName };
      item.stations.forEach((station) => {
        result[station.station] =
          totalCount > 0 ? (station.adCount / totalCount) * 100 : 0;
      });
      return result;
    });
  }, [data, selectedWeek, selectedAds]);

  // Colors for different stations
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff4d4f"];

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Shared Ad Distribution</CardTitle>
          <CardDescription>
            Percentage distribution of ads across stations for {selectedWeek}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((week) => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <MultipleSelector
            value={selectedAds}
            onChange={setSelectedAds}
            defaultOptions={adOptions}
            placeholder="Select ads"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No ads found</p>}
            className="max-w-64 w-full"
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="%" domain={[0, 100]} />
            <YAxis type="category" dataKey="adName" />
            <Tooltip formatter={(value) => {
              const num = typeof value === "number" ? value : parseFloat(value);
              return isNaN(num) ? `${value}` : `${num.toFixed(1)}%`;
            }} />
            <Legend />
            {data.stations.map((station, index) => (
              <Bar
                key={station}
                dataKey={station}
                stackId="a"
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SharedAdBar;