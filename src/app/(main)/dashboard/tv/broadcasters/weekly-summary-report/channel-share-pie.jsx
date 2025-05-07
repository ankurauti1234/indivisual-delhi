import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { PieChartIcon } from "lucide-react";

const channelColors = {
  "CH 01": "#D32F2F", // Dark Red
  "CH 02": "#FF9800", // Dark Orange
  "CH 03": "#1976D2", // Dark Blue
  "CH 04": "#0288D1", // Deep Sky Blue
  "CH 05": "#388E3C", // Dark Green
  "CH 06": "#7B1FA2", // Dark Purple
  "CH 07": "#F57C00", // Dark Amber
  "CH 08": "#0288D1", // Deep Blue
  "CH 09": "#D81B60", // Dark Pink
};


const channelData = [
  {
    channel_name: "CH 01",
    share_percentage: 10,
    fill: channelColors["CH 01"],
  },
  {
    channel_name: "CH 02",
    share_percentage: 12,
    fill: channelColors["CH 02"],
  },
  {
    channel_name: "CH 03",
    share_percentage: 14,
    fill: channelColors["CH 03"],
  },
  {
    channel_name: "CH 04",
    share_percentage: 8,
    fill: channelColors["CH 04"],
  },
  {
    channel_name: "CH 05",
    share_percentage: 20,
    fill: channelColors["CH 05"],
  },
  {
    channel_name: "CH 06",
    share_percentage: 18,
    fill: channelColors["CH 06"],
  },
  {
    channel_name: "CH 07",
    share_percentage: 10,
    fill: channelColors["CH 07"],
  },
  {
    channel_name: "CH 08",
    share_percentage: 5,
    fill: channelColors["CH 08"],
  },
  {
    channel_name: "CH 09",
    share_percentage: 3,
    fill: channelColors["CH 09"],
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border rounded shadow">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Share: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Legend = ({ data }) => (
  <div className="grid grid-cols-5 gap-1 mt-2 px-2 text-xs">
    {data.map((entry) => (
      <div key={entry.channel_name} className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.fill }}
        />
        <span className="truncate">{entry.channel_name}</span>
      </div>
    ))}
  </div>
);

export default function ChannelSharePieChart() {
    return (
      <ChartCard
        icon={<PieChartIcon className="w-6 h-6" />}
        title="TV Channel Share Distribution"
        description="Market Share Percentage"
        chart={
          <PieChart width={600} height={400} >
            <Pie
              data={channelData}
              dataKey="share_percentage"
              nameKey="channel_name"
              cx="50%"
              cy="50%"
              outerRadius={160}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        }
        footer={<Legend data={channelData} />}
      />
    );
}
