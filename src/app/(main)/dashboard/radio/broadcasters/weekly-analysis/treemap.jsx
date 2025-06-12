import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radio, Info } from "lucide-react";
import { club as clubWeek1, mango as mangoWeek1, redfm as redfmWeek1, mirchi as mirchiWeek1 } from "./treemap-data.js";
import { club as clubWeek2, mango as mangoWeek2, redfm as redfmWeek2, mirchi as mirchiWeek2 } from "./treemap-data_2.js";

// Define colors based on percentage ranges (accessible palette)
const getColorByRange = (percentage) => {
  if (percentage / 100 >= 8) return "#D32F2F"; // Red (accessible)
  if (percentage / 100 >= 6) return "#1976D2"; // Blue
  if (percentage / 100 >= 4) return "#388E3C"; // Green
  if (percentage / 100 >= 2) return "#7B1FA2"; // Purple
  return "#FBC02D"; // Yellow
};

// Aggregate data to combine duplicate categories and their brands
const aggregateData = (data) => {
  const categoryMap = data.reduce((acc, item) => {
    const { Category, Percentage, "Brand Name/Parent Comany": brand } = item;
    if (!acc[Category]) {
      acc[Category] = { size: 0, brands: new Set() };
    }
    acc[Category].size += Percentage;
    if (brand) {
      acc[Category].brands.add(brand);
    }
    return acc;
  }, {});

  return Object.entries(categoryMap).map(([name, { size, brands }]) => ({
    name,
    size,
    brands: Array.from(brands),
    fill: getColorByRange(size),
  }));
};

const SectorTreemap = () => {
  const [selectedStation, setSelectedStation] = useState("club");
  const [selectedWeek, setSelectedWeek] = useState("week1");
  const [hoveredItem, setHoveredItem] = useState(null);

  const stations = [
    { id: "club", name: "Club FM" },
    { id: "mango", name: "Mango FM" },
    { id: "redfm", name: "Red FM" },
    { id: "mirchi", name: "Mirchi FM" },
  ];

  const weeks = [
    { id: "week1", name: "Week 16" },
    { id: "week2", name: "Week 17" },
  ];

  // Map station and week data with aggregated categories
  const stationData = {
    week1: {
      club: { name: "Club FM", children: aggregateData(clubWeek1) },
      mango: { name: "Mango FM", children: aggregateData(mangoWeek1) },
      redfm: { name: "Red FM", children: aggregateData(redfmWeek1) },
      mirchi: { name: "Mirchi FM", children: aggregateData(mirchiWeek1) },
    },
    week2: {
      club: { name: "Club FM", children: aggregateData(clubWeek2) },
      mango: { name: "Mango FM", children: aggregateData(mangoWeek2) },
      redfm: { name: "Red FM", children: aggregateData(redfmWeek2) },
      mirchi: { name: "Mirchi FM", children: aggregateData(mirchiWeek2) },
    },
  };

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, size, fill } = props;
    const isHovered = hoveredItem === name;

    // Calculate dynamic font size and line height
    const fontSize = Math.min(width, height) > 100 ? 14 : Math.min(width, height) > 60 ? 12 : 10;
    const lineHeight = fontSize * 1.2;
    const maxWidth = width * 0.9; // 90% of rectangle width for padding
    const words = name?.split(" ") || [];
    let lines = [];
    let currentLine = "";
    const maxLines = Math.floor(height / lineHeight) - 1; // Reserve space for percentage

    // Wrap text
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = testLine.length * (fontSize * 0.6); // Approximate width
      if (testWidth <= maxWidth && lines.length < maxLines) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine && lines.length < maxLines) lines.push(currentLine);

    // Only render text if the rectangle is large enough
    const shouldRenderText = width > 40 && height > 40;

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={isHovered ? 0.8 : 1}
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            filter: isHovered ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" : "none",
          }}
          rx={8}
          ry={8}
          stroke="white"
          strokeWidth={2}
        />
        {shouldRenderText && (
          <text
            x={x + width / 2}
            y={y + height / 2 - (lines.length * lineHeight) / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: "500",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              opacity: isHovered ? 1 : 0.9,
              pointerEvents: "none",
            }}
          >
            {lines.map((line, index) => (
              <tspan
                key={index}
                x={x + width / 2}
                dy={index === 0 ? 0 : lineHeight}
              >
                {line}
              </tspan>
            ))}
            <tspan
              x={x + width / 2}
              dy={lineHeight}
              style={{
                fontSize: `${fontSize * 0.85}px`,
                fontWeight: "400",
              }}
            >
              {(size / 100)?.toFixed(2)}%
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const industry = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/95 p-4 rounded-xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: industry.fill }}
            />
            <h3 className="font-semibold text-base text-gray-800">{industry.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Percentage: {(industry.size / 100)?.toFixed(2)}%
          </p>
          {industry.brands?.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm text-gray-700">Top Brands:</p>
              {industry.brands.map((brand, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 truncate max-w-[200px]"
                >
                  {brand}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const currentStation = stationData[selectedWeek][selectedStation];

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <Radio className="w-7 h-7 text-primary animate-pulse" />
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Radio Ads Distribution
              </h2>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Advertisement Distribution by Percentage
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FBC02D]" />
                <span>0-2%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#7B1FA2]" />
                <span>2-4%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#388E3C]" />
                <span>4-6%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#1976D2]" />
                <span>6-8%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#D32F2F]" />
                <span>8%+</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-36">
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-full h-11 rounded-xl hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder="Select a week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((week) => (
                      <SelectItem key={week.id} value={week.id}>
                        {week.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger className="w-full h-11 rounded-xl hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder="Select a station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-800">
                {currentStation.name} - {weeks.find((w) => w.id === selectedWeek).name}
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {currentStation.children?.length} Categories
            </div>
          </div>
          <div className="h-[550px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={currentStation.children}
                dataKey="size"
                aspectRatio={4 / 3} // Adjusted for better layout
                stroke="#fff"
                content={<CustomizedContent />}
                animationDuration={600}
                animationEasing="ease-in-out"
              >
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "white", strokeWidth: 2 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorTreemap;