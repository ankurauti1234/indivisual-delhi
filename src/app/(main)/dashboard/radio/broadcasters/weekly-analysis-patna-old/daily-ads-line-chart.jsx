"use client";

import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
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
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component

// Data from previous conversation
const dailyAdsData = {
  "week19": [
    {
      "date": "07 May",
      "bigfm": { "count": 797, "seconds": 11033 },
      "radiocity": { "count": 1213, "seconds": 14642 },
      "radiomirchi": { "count": 834, "seconds": 15192 },
      "redfm": { "count": 741, "seconds": 12722 }
    },
    {
      "date": "08 May",
      "bigfm": { "count": 816, "seconds": 11604 },
      "radiocity": { "count": 1248, "seconds": 16322 },
      "radiomirchi": { "count": 826, "seconds": 16085 },
      "redfm": { "count": 733, "seconds": 13300 }
    },
    {
      "date": "09 May",
      "bigfm": { "count": 825, "seconds": 11893 },
      "radiocity": { "count": 1208, "seconds": 16057 },
      "radiomirchi": { "count": 792, "seconds": 16102 },
      "redfm": { "count": 662, "seconds": 12968 }
    },
    {
      "date": "10 May",
      "bigfm": { "count": 789, "seconds": 9428 },
      "radiocity": { "count": 1101, "seconds": 12962 },
      "radiomirchi": { "count": 561, "seconds": 11418 },
      "redfm": { "count": 526, "seconds": 10411 }
    },
    {
      "date": "11 May",
      "bigfm": { "count": 693, "seconds": 8638 },
      "radiocity": { "count": 779, "seconds": 9400 },
      "radiomirchi": { "count": 433, "seconds": 9170 },
      "redfm": { "count": 386, "seconds": 7500 }
    },
    {
      "date": "12 May",
      "bigfm": { "count": 910, "seconds": 11796 },
      "radiocity": { "count": 959, "seconds": 12425 },
      "radiomirchi": { "count": 20, "seconds": 412 },
      "redfm": { "count": 0, "seconds": 0 }
    },
    {
      "date": "13 May",
      "bigfm": { "count": 889, "seconds": 11207 },
      "radiocity": { "count": 1087, "seconds": 13650 },
      "radiomirchi": { "count": 753, "seconds": 15100 },
      "redfm": { "count": 362, "seconds": 6872 }
    },
  ],
  "week20": [
      {
      "date": "14 May",
      "bigfm": { "count": 911, "seconds": 11999 },
      "radiocity": { "count": 1099, "seconds": 14542 },
      "radiomirchi": { "count": 829, "seconds": 15847 },
      "redfm": { "count": 554, "seconds": 10806 }
    },
    {
      "date": "15 May",
      "bigfm": { "count": 887, "seconds": 11500 },
      "radiocity": { "count": 1132, "seconds": 14075 },
      "radiomirchi": { "count": 834, "seconds": 16741 },
      "redfm": { "count": 544, "seconds": 11042 }
    },
    {
      "date": "16 May",
      "bigfm": { "count": 917, "seconds": 12795 },
      "radiocity": { "count": 1187, "seconds": 16269 },
      "radiomirchi": { "count": 817, "seconds": 17327 },
      "redfm": { "count": 626, "seconds": 12525 }
    },
    {
      "date": "17 May",
      "bigfm": { "count": 764, "seconds": 10849 },
      "radiocity": { "count": 1128, "seconds": 13913 },
      "radiomirchi": { "count": 790, "seconds": 15219 },
      "redfm": { "count": 679, "seconds": 11495 }
    },
    {
      "date": "18 May",
      "bigfm": { "count": 612, "seconds": 7649 },
      "radiocity": { "count": 684, "seconds": 8114 },
      "radiomirchi": { "count": 583, "seconds": 12388 },
      "redfm": { "count": 548, "seconds": 9244 }
    },
    {
      "date": "19 May",
      "bigfm": { "count": 750, "seconds": 10163 },
      "radiocity": { "count": 1054, "seconds": 14602 },
      "radiomirchi": { "count": 904, "seconds": 19848 },
      "redfm": { "count": 750, "seconds": 13501 }
    },
    {
      "date": "20 May",
      "bigfm": { "count": 845, "seconds": 10203 },
      "radiocity": { "count": 1079, "seconds": 14583 },
      "radiomirchi": { "count": 461, "seconds": 10300 },
      "redfm": { "count": 695, "seconds": 12266 }
    }
  ]
}

const chartConfig = {
  radiocity: {
    label: "Radio City",
    color: "hsl(var(--chart-1))",
  },
  redfm: {
    label: "Red FM",
    color: "hsl(var(--chart-2))",
  },
  bigfm: {
    label: "Big FM",
    color: "hsl(var(--chart-3))",
  },
  radiomirchi: {
    label: "Radio Mirchi",
    color: "hsl(var(--chart-4))",
  },
};

export default function DailyAdsLineChart() {
  const [selectedWeeks, setSelectedWeeks] = useState(["week19"]);
  const [showSeconds, setShowSeconds] = useState(false);

  // Combine data from selected weeks
  const chartData = selectedWeeks
    .flatMap((week) =>
      dailyAdsData[week].map((item) => ({
        date: item.date,
        day: item.day,
        week: week,
        radiocity: item.radiocity[showSeconds ? "seconds" : "count"],
        redfm: item.redfm[showSeconds ? "seconds" : "count"],
        bigfm: item.bigfm[showSeconds ? "seconds" : "count"],
        radiomirchi: item.radiomirchi[showSeconds ? "seconds" : "count"],
      }))
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get boundary dates between weeks for visual separation
  const weekBoundaries = chartData
    .reduce((acc, item, index) => {
      if (index > 0 && item.week !== chartData[index - 1].week) {
        acc.push(chartData[index - 1].date);
      }
      return acc;
    }, [])
    .map((date) => ({ date }));

  const handleWeekChange = (week) => {
    setSelectedWeeks((prev) => {
      if (prev.includes(week)) {
        // Remove week if already selected, but ensure at least one week remains
        const newWeeks = prev.filter((w) => w !== week);
        return newWeeks.length > 0 ? newWeeks : prev;
      }
      // Add week if not selected
      return [...prev, week];
    });
  };

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

  // Generate description based on selected weeks
  const getDescription = () => {
    if (selectedWeeks.length === 1) {
      return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Plays"} per Day - ${
        selectedWeeks[0] === "week19" ? "Week 19 (May 07-13)" : "Week 20 (May 14-20)"
      } 2025`;
    }
    const weekNames = selectedWeeks.map((week) =>
      week === "week19" ? "Week 19 (May 07-13)" : "Week 20 (May 14-20)"
    );
    return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Plays"} per Day - ${weekNames.join(" and ")} 2025`;
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
            <Label htmlFor="unit-toggle">{showSeconds ? "Seconds" : "Plays"}</Label>
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={selectedWeeks.length > 0 ? `${selectedWeeks.length} week(s) selected` : "Select weeks"} />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week19"
                    checked={selectedWeeks.includes("week19")}
                    onCheckedChange={() => handleWeekChange("week19")}
                  />
                  <Label htmlFor="week19">Week 19 (May 07-13)</Label>
20      1  2   </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week20"
                    checked={selectedWeeks.includes("week20")}
                    onCheckedChange={() => handleWeekChange("week20")}
                  />
                  <Label htmlFor="week20">Week 20 (May 14-20)</Label>
                </div>
              </div>
            </SelectContent>
          </Select>
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
            {weekBoundaries.map((boundary, index) => (
              <ReferenceLine
                key={index}
                x={boundary.date}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: `End of ${selectedWeeks[index] === "week19" ? "Week 16" : "Week 20"}`,
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            ))}
            <Line
              type="linear"
              dataKey="radiocity"
              stroke={chartConfig.radiocity.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="radiocity" />}
              activeDot={{ r: 6, stroke: chartConfig.radiocity.color, strokeWidth: 4, fill: "#fff" }}
            />
            <Line
              type="linear"
              dataKey="redfm"
              stroke={chartConfig.redfm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="redfm" />}
              activeDot={{ r: 6, stroke: chartConfig.redfm.color, strokeWidth: 4, fill: "#fff" }}
            />
            <Line
              type="linear"
              dataKey="bigfm"
              stroke={chartConfig.bigfm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="bigfm" />}
              activeDot={{ r: 6, stroke: chartConfig.bigfm.color, strokeWidth: 4, fill: "#fff" }}
            />
            <Line
              type="linear"
              dataKey="radiomirchi"
              stroke={chartConfig.radiomirchi.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="radiomirchi" />}
              activeDot={{ r: 6, stroke: chartConfig.radiomirchi.color, strokeWidth: 4, fill: "#fff" }}
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
            Daily ad {showSeconds ? "duration" : "count"} trends for {selectedWeeks
              .map((week) => (week === "week19" ? "Week 19 (May 07-13)" : "Week 20 (May 14-20)"))
              .join(" and ")} showing all radio stations
          </p>
        </div>
      }
    />
  );
}