"use client";

import { TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
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
import { Checkbox } from "@/components/ui/checkbox";

// Data from previous conversation
const dailyAdsData = {
  week19: [
    {
      date: "07 May",
      day: "Monday",
      radio_city: { count: 1019, seconds: 14617 },
      radio_mirchi: { count: 1096, seconds: 16509 },
      radio_one: { count: 433, seconds: 7899 },
      red_fm: { count: 1055, seconds: 18022 },
    },
    {
      date: "08 May",
      day: "Tuesday",
      radio_city: { count: 1004, seconds: 15736 },
      radio_mirchi: { count: 1038, seconds: 19072 },
      radio_one: { count: 464, seconds: 8859 },
      red_fm: { count: 1121, seconds: 20125 },
    },
    {
      date: "09 May",
      day: "Wednesday",
      radio_city: { count: 1315, seconds: 19779 },
      radio_mirchi: { count: 1202, seconds: 22045 },
      radio_one: { count: 434, seconds: 7311 },
      red_fm: { count: 1323, seconds: 25480 },
    },
    {
      date: "10 May",
      day: "Thursday",
      radio_city: { count: 1015, seconds: 12579 },
      radio_mirchi: { count: 293, seconds: 5189 },
      radio_one: { count: 170, seconds: 4105 },
      red_fm: { count: 537, seconds: 9000 },
    },
    {
      date: "11 May",
      day: "Friday",
      radio_city: { count: 857, seconds: 9170 },
      radio_mirchi: { count: 259, seconds: 4944 },
      red_fm: { count: 421, seconds: 7378 },
    },
    {
      date: "12 May",
      day: "Saturday",
      radio_city: { count: 999, seconds: 17911 },
      radio_mirchi: { count: 755, seconds: 12744 },
      radio_one: { count: 341, seconds: 6667 },
      red_fm: { count: 740, seconds: 13541 },
    },
    {
      date: "13 May",
      day: "Sunday",
      radio_city: { count: 1060, seconds: 18447 },
      radio_mirchi: { count: 833, seconds: 14508 },
      radio_one: { count: 395, seconds: 7088 },
      red_fm: { count: 768, seconds: 13908 },
    },
  ],
  week20: [
    {
      date: "14 May",
      radio_city: { count: 1037, seconds: 18078, hours: 5.021666667 },
      radio_mirchi: { count: 877, seconds: 15951, hours: 4.430833333 },
      radio_one: { count: 427, seconds: 8249, hours: 2.291388889 },
      red_fm: { count: 783, seconds: 14342, hours: 3.983888889 },
    },
    {
      date: "15 May",
      radio_city: { count: 1487, seconds: 22991, hours: 6.386388889 },
      radio_mirchi: { count: 1138, seconds: 21098, hours: 5.860555556 },
      radio_one: { count: 146, seconds: 2743, hours: 0.7619444444 },
      red_fm: { count: 933, seconds: 17745, hours: 4.929166667 },
    },
    {
      date: "16 May",
      radio_city: { count: 1434, seconds: 13232, hours: 3.675555556 },
      radio_mirchi: { count: 1133, seconds: 21010, hours: 5.836111111 },
      radio_one: { count: 490, seconds: 8268, hours: 2.296666667 },
      red_fm: { count: 911, seconds: 16914, hours: 4.698333333 },
    },
    {
      date: "17 May",
      radio_city: { count: 1251, seconds: 17347, hours: 4.818611111 },
      radio_mirchi: { count: 668, seconds: 12157, hours: 3.376944444 },
      radio_one: { count: 317, seconds: 5305, hours: 1.473611111 },
      red_fm: { count: 745, seconds: 10229, hours: 2.841388889 },
    },
    {
      date: "18 May",
      radio_city: { count: 940, seconds: 12542, hours: 3.483888889 },
      radio_mirchi: { count: 486, seconds: 8708, hours: 2.418888889 },
      radio_one: { count: 245, seconds: 4965, hours: 1.379166667 },
      red_fm: { count: 615, seconds: 8234, hours: 2.287222222 },
    },
    {
      date: "19 May",
      radio_city: { count: 1456, seconds: 20191, hours: 5.608611111 },
      radio_mirchi: { count: 1081, seconds: 20647, hours: 5.735277778 },
      radio_one: { count: 410, seconds: 8246, hours: 2.290555556 },
      red_fm: { count: 1159, seconds: 20540, hours: 5.705555556 },
    },
    {
      date: "20 May",
      radio_city: { count: 1465, seconds: 21825, hours: 6.0625 },
      radio_mirchi: { count: 1116, seconds: 20885, hours: 5.801388889 },
      radio_one: { count: 361, seconds: 7577, hours: 2.104722222 },
      red_fm: { count: 1261, seconds: 22206, hours: 6.168333333 },
    },
  ],
};

const chartConfig = {
  radio_city: {
    label: "Radio City",
    color: "hsl(var(--chart-1))",
  },
  red_fm: {
    label: "Red FM",
    color: "hsl(var(--chart-2))",
  },
  radio_one: {
    label: "Radio One",
    color: "hsl(var(--chart-3))",
  },
  radio_mirchi: {
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
        radio_city: item.radio_city[showSeconds ? "seconds" : "count"],
        red_fm: item.red_fm[showSeconds ? "seconds" : "count"],
        radio_one: item.radio_one
          ? item.radio_one[showSeconds ? "seconds" : "count"]
          : 0, // Handle missing radio_one data
        radio_mirchi: item.radio_mirchi[showSeconds ? "seconds" : "count"],
      }))
    )
    .sort((a, b) => new Date(`2025 ${a.date}`) - new Date(`2025 ${b.date}`));

  // Get boundary dates between weeks for visual separation (not needed for single week)
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
      return `${
        showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"
      } per Day - Week 19 (May 7-13) 2025`;
    }
    const weekNames = selectedWeeks.map(
      (week) => `Week ${week.replace("week", "")} (May 7-13)`
    );
    return `${
      showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"
    } per Day - ${weekNames.join(" and ")} 2025`;
  };

  return (
    <ChartCard
      icon={<TrendingUp className="w-6 h-6" />}
      title={showSeconds ? "Daily Ad Duration Trends" : "Daily Ad Count Trends"}
      description={getDescription()}
      action={
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="unit-toggle"
              checked={showSeconds}
              onCheckedChange={setShowSeconds}
            />
            <Label htmlFor="unit-toggle">
              {showSeconds ? "Seconds" : "Counts"}
            </Label>
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue
                placeholder={
                  selectedWeeks.length > 0
                    ? `${selectedWeeks.length} week(s) selected`
                    : "Select weeks"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week19"
                    checked={selectedWeeks.includes("week19")}
                    onCheckedChange={() => handleWeekChange("week19")}
                  />
                  <Label htmlFor="week19">Week 19 (May 7-13)</Label>
                </div>

                                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week20"
                    checked={selectedWeeks.includes("week20")}
                    onCheckedChange={() => handleWeekChange("week20")}
                  />
                  <Label htmlFor="week20">Week 20 (May 14-20)</Label>
                </div>
                {/* Add more weeks here if additional data is provided */}
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
                  value: `End of Week ${selectedWeeks[index].replace(
                    "week",
                    ""
                  )}`,
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            ))}
            <Line
              type="linear"
              dataKey="radio_city"
              stroke={chartConfig.radio_city.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="radio_city" />}
              activeDot={{
                r: 6,
                stroke: chartConfig.radio_city.color,
                strokeWidth: 4,
                fill: "#fff",
              }}
            />
            <Line
              type="linear"
              dataKey="red_fm"
              stroke={chartConfig.red_fm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="red_fm" />}
              activeDot={{
                r: 6,
                stroke: chartConfig.red_fm.color,
                strokeWidth: 4,
                fill: "#fff",
              }}
            />
            <Line
              type="linear"
              dataKey="radio_one"
              stroke={chartConfig.radio_one.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="radio_one" />}
              activeDot={{
                r: 6,
                stroke: chartConfig.radio_one.color,
                strokeWidth: 4,
                fill: "#fff",
              }}
            />
            <Line
              type="linear"
              dataKey="radio_mirchi"
              stroke={chartConfig.radio_mirchi.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="radio_mirchi" />}
              activeDot={{
                r: 6,
                stroke: chartConfig.radio_mirchi.color,
                strokeWidth: 4,
                fill: "#fff",
              }}
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
            Daily ad {showSeconds ? "duration" : "count"} trends for{" "}
            {selectedWeeks
              .map((week) => `Week ${week.replace("week", "")} (May 7-13)`)
              .join(" and ")}{" "}
            showing all radio stations
          </p>
        </div>
      }
    />
  );
}
