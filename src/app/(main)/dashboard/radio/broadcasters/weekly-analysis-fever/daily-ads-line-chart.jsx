"use client";

import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const dailyAdsData = {
  "week25": [
    {
      "date": "16 Jun",
      "day": "Monday",
      "fever_fm": { "count": 722, "seconds": 14701 }
    },
    {
      "date": "17 Jun",
      "day": "Tuesday",
      "fever_fm": { "count": 727, "seconds": 15086 }
    },
    {
      "date": "18 Jun",
      "day": "Wednesday",
      "fever_fm": { "count": 865, "seconds": 17997 }
    },
    {
      "date": "19 Jun",
      "day": "Thursday",
      "fever_fm": { "count": 862, "seconds": 17923 }
    },
    {
      "date": "20 Jun",
      "day": "Friday",
      "fever_fm": { "count": 965, "seconds": 20128 }
    },
    {
      "date": "21 Jun",
      "day": "Saturday",
      "fever_fm": { "count": 648, "seconds": 12932 }
    },
    {
      "date": "22 Jun",
      "day": "Sunday",
      "fever_fm": { "count": 554, "seconds": 11362 }
    }
  ]
};

const chartConfig = {
  fever_fm: {
    label: "Fever FM",
    color: "hsl(var(--chart-1))"
  }
};

export default function DailyAdsLineChart() {
  const [showSeconds, setShowSeconds] = useState(false);

  // Prepare chart data for Fever FM only
  const chartData = dailyAdsData["week25"].map((item) => ({
    date: item.date,
    day: item.day,
    fever_fm: item.fever_fm[showSeconds ? "seconds" : "count"],
  }));

  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={chartConfig[dataKey]?.color}
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize={14}
          fill={chartConfig[dataKey]?.color}
          fontWeight="600"
        >
          {payload[dataKey]}
        </text>
      </g>
    );
  };

  const formatValue = (value) => {
    return Math.round(value).toLocaleString() + (showSeconds ? "s" : "");
  };

  // Description for Week 25
  const getDescription = () => {
    return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"} per Day - Week 25 (June 16-22, 2025)`;
  };

  return (
    <ChartCard
      icon={<TrendingUp className="w-6 h-6" />}
      title={showSeconds ? "Daily Ad Duration Trends" : "Daily Ad Count Trends"}
      description={getDescription()}
      action={
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch id="unit-toggle" checked={showSeconds} onCheckedChange={setShowSeconds} />
            <Label htmlFor="unit-toggle">{showSeconds ? "Seconds" : "Counts"}</Label>
          </div>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            }}
            height={300}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground))"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              textAnchor="end"
              height={60}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              tickFormatter={formatValue}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}`}
                  formatter={(value, name) => [
                    `${formatValue(value)} ${showSeconds ? "seconds" : "ads"}`,
                    chartConfig[name]?.label || name,
                  ]}
                />
              }
            />
            <Line
              type="linear"
              dataKey="fever_fm"
              stroke={chartConfig.fever_fm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="fever_fm" />}
              activeDot={{ r: 6, stroke: chartConfig.fever_fm.color, strokeWidth: 4, fill: "#fff" }}
            />
          </LineChart>
        </ChartContainer>
      }
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Daily ad {showSeconds ? "duration" : "count"} trends for Week 25 (June 16-22, 2025) showing Fever FM
          </p>
        </div>
      }
    />
  );
}