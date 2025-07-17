"use client";

import React, { useState, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";

// Vibrant colors for treemap rectangles
const COLORS = [
  "#FF4B4B", // Red
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFC107", // Yellow
  "#E91E63", // Pink
  "#00BCD4", // Cyan
  "#FF9800", // Orange
  "#9C27B0", // Purple
];

const MarketShareTreemap = ({ data, secondsData }) => {
  const [selectedWeek, setSelectedWeek] = useState(data.weeks[0] || "");
  const [selectedStation, setSelectedStation] = useState(data.stations[0]?.station || "");
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [usespots, setUsespots] = useState(true); // Toggle state: true for spots, false for seconds

  // Reset drill-down when station or week changes
  const handleStationChange = (value) => {
    setSelectedStation(value);
    setSelectedSector(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    setSelectedSector(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
  };

  // Derive station and week options
  const stationOptions = data.stations.map(station => ({
    value: station.station,
    label: station.station,
  }));

  const weekOptions = data.weeks.map(week => ({
    value: week,
    label: week,
  }));

  // Determine current level
  const getCurrentLevel = () => {
    if (selectedBrand) return "subBrands";
    if (selectedCategory) return "brands";
    if (selectedSector) return "categories";
    return "sectors";
  };

  // Get title based on current level
  const getTitle = () => {
    const weekDisplay = selectedWeek;
    const unit = usespots ? "Spots" : "Seconds";
    if (selectedBrand) return `${selectedBrand} Sub-Brands (${unit}, Week: ${weekDisplay}, Station: ${selectedStation})`;
    if (selectedCategory) return `${selectedCategory} Brands (${unit}, Week: ${weekDisplay}, Station: ${selectedStation})`;
    if (selectedSector) return `${selectedSector} Categories (${unit}, Week: ${weekDisplay}, Station: ${selectedStation})`;
    return `Market Share by Sector (${unit}, Week: ${weekDisplay}, Station: ${selectedStation})`;
  };

  // Prepare treemap data
  const treemapData = useMemo(() => {
    const currentData = usespots ? data : secondsData;
    const stationData = currentData.stations.find(s => s.station === selectedStation);
    if (!stationData) return [];

    const currentLevel = getCurrentLevel();
    let items = [];

    if (currentLevel === "sectors") {
      items = stationData.sectors;
    } else if (currentLevel === "categories") {
      const sector = stationData.sectors.find(s => s.name === selectedSector);
      items = sector?.categories || [];
    } else if (currentLevel === "brands") {
      const sector = stationData.sectors.find(s => s.name === selectedSector);
      const category = sector?.categories?.find(c => c.name === selectedCategory);
      items = category?.brands || [];
    } else if (currentLevel === "subBrands") {
      const sector = stationData.sectors.find(s => s.name === selectedSector);
      const category = sector?.categories?.find(c => c.name === selectedCategory);
      const brand = category?.brands?.find(b => b.name === selectedBrand);
      items = brand?.subBrands || [];
    }

    // Calculate total marketShare for normalization (used for treemap proportions)
    const totalMarketShare = items.reduce((sum, item) => sum + item.marketShare, 0);

    return items.map((item, index) => ({
      name: item.name,
      size: totalMarketShare > 0 ? (item.marketShare / totalMarketShare) * 100 : 0, // Normalize for treemap size
      rawValue: item.marketShare, // Store raw value for display
      color: COLORS[index % COLORS.length],
    }));
  }, [data, secondsData, selectedStation, selectedSector, selectedCategory, selectedBrand, usespots]);

  // Handle treemap click for drill-down
  const handleClick = (name) => {
    const currentData = usespots ? data : secondsData;
    const currentLevel = getCurrentLevel();
    const stationData = currentData.stations.find(s => s.station === selectedStation);
    if (!stationData) return;

    if (currentLevel === "sectors") {
      const sector = stationData.sectors.find(s => s.name === name);
      if (sector?.categories) setSelectedSector(name);
    } else if (currentLevel === "categories") {
      const sector = stationData.sectors.find(s => s.name === selectedSector);
      const category = sector?.categories?.find(c => c.name === name);
      if (category?.brands) setSelectedCategory(name);
    } else if (currentLevel === "brands") {
      const sector = stationData.sectors.find(s => s.name === selectedSector);
      const category = sector?.categories?.find(c => c.name === selectedCategory);
      const brand = category?.brands?.find(b => b.name === name);
      if (brand?.subBrands) setSelectedBrand(name);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (selectedBrand) {
      setSelectedBrand(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedSector) {
      setSelectedSector(null);
    }
  };

  // Custom treemap content
  const CustomizedContent = ({ x, y, width, height, name, size, rawValue, color }) => {
    const isHovered = hoveredItem === name;
    const display = width > 50 && height > 50;
    const currentLevel = getCurrentLevel();

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => currentLevel !== "subBrands" && handleClick(name)}
        style={{ cursor: currentLevel !== "subBrands" ? "pointer" : "default" }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          style={{
            transition: "all 0.3s ease",
          }}
          rx={8}
          ry={8}
          stroke="white"
          strokeWidth={2}
        />
        {display && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: width > 100 ? "16px" : "12px",
              fontWeight: "500",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            <tspan x={x + width / 2} dy="-0.5em">
              {name}
            </tspan>
            <tspan
              x={x + width / 2}
              dy="1.5em"
              style={{
                fontSize: width > 100 ? "14px" : "11px",
                fontWeight: "400",
              }}
            >
              {Math.round(rawValue)} {usespots ? "" : "s"}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <h3 className="font-semibold text-lg">{data.name}</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {usespots ? `Spots: ${Math.round(data.rawValue)}` : `Seconds: ${Math.round(data.rawValue)}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>
            View market share distribution across sectors, categories, brands, and sub-brands
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={usespots}
              onCheckedChange={setUsespots}
              id="toggle-unit"
            />
            <label htmlFor="toggle-unit" className="text-sm">
              {usespots ? "Spots" : "Seconds"}
            </label>
          </div>
          <Select value={selectedWeek} onValueChange={handleWeekChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map(week => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStation} onValueChange={handleStationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map(station => (
                <SelectItem key={station.value} value={station.value}>
                  {station.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(selectedSector || selectedCategory || selectedBrand) && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {selectedBrand ? "Brands" : selectedCategory ? "Categories" : "Sectors"}
            </button>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        {treemapData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            No data available for the selected {getCurrentLevel()}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              aspectRatio={16 / 9}
              content={<CustomizedContent />}
              animationEasing="ease-out"
            >
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "white", strokeWidth: 2 }} />
            </Treemap>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketShareTreemap;