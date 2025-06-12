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
  week16: [
    {
      date: "Thu 17 Apr",
      day: "Thursday",
      mangofm: { count: 461, seconds: 10111 },
      redfm: { count: 1112, seconds: 15172 },
      clubfm: { count: 440, seconds: 8702 },
      radiomirchi: { count: 347, seconds: 6472 },
    },
    {
      date: "Fri 18 Apr",
      day: "Friday",
      mangofm: { count: 479, seconds: 10344 },
      redfm: { count: 1011, seconds: 12686 },
      clubfm: { count: 407, seconds: 8452 },
      radiomirchi: { count: 355, seconds: 6162 },
    },
    {
      date: "Sat 19 Apr",
      day: "Saturday",
      mangofm: { count: 353, seconds: 7151 },
      redfm: { count: 929, seconds: 12163 },
      clubfm: { count: 483, seconds: 11049 },
      radiomirchi: { count: 351, seconds: 5767 },
    },
    {
      date: "Sun 20 Apr",
      day: "Sunday",
      mangofm: { count: 293, seconds: 5698 },
      redfm: { count: 813, seconds: 11136 },
      clubfm: { count: 427, seconds: 7477 },
      radiomirchi: { count: 220, seconds: 4948 },
    },
    {
      date: "Mon 21 Apr",
      day: "Monday",
      mangofm: { count: 280, seconds: 6167 },
      redfm: { count: 896, seconds: 11833 },
      clubfm: { count: 281, seconds: 6556 },
      radiomirchi: { count: 0, seconds: 0 },
    },
    {
      date: "Tue 22 Apr",
      day: "Tuesday",
      mangofm: { count: 286, seconds: 6207 },
      redfm: { count: 905, seconds: 11264 },
      clubfm: { count: 262, seconds: 6004 },
      radiomirchi: { count: 250, seconds: 4176 },
    },
    {
      date: "Wed 23 Apr",
      day: "Wednesday",
      mangofm: { count: 353, seconds: 7110 },
      redfm: { count: 956, seconds: 12611 },
      clubfm: { count: 387, seconds: 8326 },
      radiomirchi: { count: 287, seconds: 5060 },
    },
  ],
  week17: [
    {
      date: "Thu 24 Apr",
      day: "Thursday",
      mangofm: { count: 412, seconds: 8221 },
      redfm: { count: 928, seconds: 11535 },
      clubfm: { count: 383, seconds: 7090 },
      radiomirchi: { count: 251, seconds: 3894 },
    },
    {
      date: "Fri 25 Apr",
      day: "Friday",
      mangofm: { count: 299, seconds: 5658 },
      redfm: { count: 767, seconds: 9612 },
      clubfm: { count: 298, seconds: 6123 },
      radiomirchi: { count: 242, seconds: 3741 },
    },
    {
      date: "Sat 26 Apr",
      day: "Saturday",
      mangofm: { count: 271, seconds: 5050 },
      redfm: { count: 737, seconds: 7603 },
      clubfm: { count: 309, seconds: 6444 },
      radiomirchi: { count: 213, seconds: 2851 },
    },
    {
      date: "Sun 27 Apr",
      day: "Sunday",
      mangofm: { count: 192, seconds: 3501 },
      redfm: { count: 531, seconds: 6662 },
      clubfm: { count: 0, seconds: 0 },
      radiomirchi: { count: 0, seconds: 0 },
    },
    {
      date: "Mon 28 Apr",
      day: "Monday",
      mangofm: { count: 274, seconds: 4970 },
      redfm: { count: 771, seconds: 8704 },
      clubfm: { count: 282, seconds: 6076 },
      radiomirchi: { count: 265, seconds: 4378 },
    },
    {
      date: "Tue 29 Apr",
      day: "Tuesday",
      mangofm: { count: 300, seconds: 5884 },
      redfm: { count: 843, seconds: 10893 },
      clubfm: { count: 326, seconds: 7370 },
      radiomirchi: { count: 0, seconds: 0 },
    },
    {
      date: "Wed 30 Apr",
      day: "Wednesday",
      mangofm: { count: 316, seconds: 6386 },
      redfm: { count: 891, seconds: 12039 },
      clubfm: { count: 350, seconds: 8200 },
      radiomirchi: { count: 0, seconds: 0 },
    },
  ],
};

const chartConfig = {
  mangofm: {
    label: "Mango FM",
    color: "hsl(var(--chart-1))",
  },
  redfm: {
    label: "Red FM",
    color: "hsl(var(--chart-2))",
  },
  clubfm: {
    label: "Club FM",
    color: "hsl(var(--chart-3))",
  },
  radiomirchi: {
    label: "Radio Mirchi",
    color: "hsl(var(--chart-4))",
  },
};

export default function DailyAdsLineChart() {
  const [selectedWeeks, setSelectedWeeks] = useState(["week16"]);
  const [showSeconds, setShowSeconds] = useState(false);

  // Combine data from selected weeks
  const chartData = selectedWeeks
    .flatMap((week) =>
      dailyAdsData[week].map((item) => ({
        date: item.date,
        day: item.day,
        week: week,
        mangofm: item.mangofm[showSeconds ? "seconds" : "count"],
        redfm: item.redfm[showSeconds ? "seconds" : "count"],
        clubfm: item.clubfm[showSeconds ? "seconds" : "count"],
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
      return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"} per Day - ${
        selectedWeeks[0] === "week16" ? "Week 16 (Apr 17-23)" : "Week 17 (Apr 24-30)"
      } 2024`;
    }
    const weekNames = selectedWeeks.map((week) =>
      week === "week16" ? "Week 16 (Apr 17-23)" : "Week 17 (Apr 24-30)"
    );
    return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Counts"} per Day - ${weekNames.join(" and ")} 2024`;
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
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={selectedWeeks.length > 0 ? `${selectedWeeks.length} week(s) selected` : "Select weeks"} />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week16"
                    checked={selectedWeeks.includes("week16")}
                    onCheckedChange={() => handleWeekChange("week16")}
                  />
                  <Label htmlFor="week16">Week 16 (Apr 17-23)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week17"
                    checked={selectedWeeks.includes("week17")}
                    onCheckedChange={() => handleWeekChange("week17")}
                  />
                  <Label htmlFor="week17">Week 17 (Apr 24-30)</Label>
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
                  value: `End of ${selectedWeeks[index] === "week16" ? "Week 16" : "Week 17"}`,
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            ))}
            <Line
              type="linear"
              dataKey="mangofm"
              stroke={chartConfig.mangofm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="mangofm" />}
              activeDot={{ r: 6, stroke: chartConfig.mangofm.color, strokeWidth: 4, fill: "#fff" }}
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
              dataKey="clubfm"
              stroke={chartConfig.clubfm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="clubfm" />}
              activeDot={{ r: 6, stroke: chartConfig.clubfm.color, strokeWidth: 4, fill: "#fff" }}
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
              .map((week) => (week === "week16" ? "Week 16 (Apr 17-23)" : "Week 17 (Apr 24-30)"))
              .join(" and ")} showing all radio stations
          </p>
        </div>
      }
    />
  );
}