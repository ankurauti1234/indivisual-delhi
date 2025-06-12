import React, { useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowLeft, Tv } from "lucide-react";
import { sectorData } from "./treemap-sector-data";
import { sectorSecondsData } from "./treemap-sector-seconds-data";
import ChartCard from "@/components/card/charts-card";
import { Button } from "@/components/ui/button";

// Vibrant crayon-inspired colors with good visibility
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

const TVChannelTreemap = () => {
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [selectedStation, setSelectedStation] = useState("Radio Mango");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dataType, setDataType] = useState("plays"); // Toggle between "plays" and "seconds"

  const weeks = ["week16", "week17"];
  const stations = ["Radio Mango", "Radio Mirchi", "Red FM", "Club FM"];

  const getCurrentLevel = () => {
    if (selectedBrand) return "products";
    if (selectedCategory) return "brands";
    if (selectedChannel) return "categories";
    return "channels";
  };

  const getTitle = () => {
    const weekDisplay = selectedWeek === "week16" ? "Week 16" : "Week 17";
    const metric = dataType === "plays" ? "Plays" : "Seconds";
    if (selectedBrand) {
      return `${selectedBrand} Products ${metric} (${weekDisplay} - ${selectedStation})`;
    }
    if (selectedCategory) {
      return `${selectedCategory} Brands ${metric} (${weekDisplay} - ${selectedStation})`;
    }
    if (selectedChannel) {
      return `${selectedChannel} Categories ${metric} (${weekDisplay} - ${selectedStation})`;
    }
    return `Market ${metric} by Sector (${weekDisplay} - ${selectedStation})`;
  };

  const getData = () => {
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (selectedBrand) {
      const products =
        data[selectedChannel]?.categories?.[selectedCategory]?.brands?.[
          selectedBrand
        ]?.products || [];
      const categoryColor =
        data[selectedChannel]?.categories?.[selectedCategory]?.color ||
        COLORS[0];
      return products.map((product, index) => ({
        name: product.name,
        size: product.sum || 0,
        color: categoryColor, // Use category color for products
      }));
    }
    if (selectedCategory) {
      const brands =
        data[selectedChannel]?.categories?.[selectedCategory]?.brands || {};
      const categoryColor =
        data[selectedChannel]?.categories?.[selectedCategory]?.color ||
        COLORS[0];
      return Object.entries(brands).map(([name, brandData], index) => ({
        name,
        size: brandData.sum || 0,
        color: categoryColor, // Use category color for brands
      }));
    }
    if (selectedChannel) {
      const categories = data[selectedChannel]?.categories || {};
      const channelColor = data[selectedChannel]?.color || COLORS[0];
      return Object.entries(categories).map(([name, categoryData], index) => ({
        name,
        size: categoryData.sum || 0,
        color: categoryData.color || channelColor, // Use channel color if category color is missing
      }));
    }
    return Object.entries(data).map(([name, channelData], index) => ({
      name,
      size: channelData.sum || 0,
      color: channelData.color || COLORS[index % COLORS.length], // Assign unique color per channel
    }));
  };

  const handleClick = (name) => {
    const level = getCurrentLevel();
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (level === "channels" && data[name]?.categories) {
      setSelectedChannel(name);
    } else if (
      level === "categories" &&
      data[selectedChannel]?.categories?.[name]?.brands
    ) {
      setSelectedCategory(name);
    } else if (
      level === "brands" &&
      data[selectedChannel]?.categories?.[selectedCategory]?.brands?.[name]
        ?.products
    ) {
      setSelectedBrand(name);
    }
  };

  const handleBack = () => {
    if (selectedBrand) {
      setSelectedBrand(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedChannel) {
      setSelectedChannel(null);
    }
  };

  const CustomizedContent = ({ x, y, width, height, name, size, color }) => {
    const isHovered = hoveredItem === name;
    const display = width > 50 && height > 50;
    const level = getCurrentLevel();

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => level !== "products" && handleClick(name)}
        style={{ cursor: level !== "products" ? "pointer" : "default" }}
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
              {dataType === "plays" ? `${size} Plays` : `${size}s`}
            </tspan>
          </text>
        )}
      </g>
    );
  };

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
              {dataType === "plays" ? `Plays: ${data.size}` : `Duration: ${data.size}s`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const data = getData();

  return (
    <ChartCard
      icon={<Tv className="w-6 h-6" />}
      title={getTitle()}
      description="View market share distribution across sectors, categories, brands, and products"
      action={
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4 items-center">
            <select
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(e.target.value);
                setSelectedChannel(null);
                setSelectedCategory(null);
                setSelectedBrand(null);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {weeks.map((week) => (
                <option key={week} value={week}>
                  {week === "week16" ? "Week 16" : "Week 17"}
                </option>
              ))}
            </select>
            <select
              value={selectedStation}
              onChange={(e) => {
                setSelectedStation(e.target.value);
                setSelectedChannel(null);
                setSelectedCategory(null);
                setSelectedBrand(null);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {stations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                setDataType(dataType === "plays" ? "seconds" : "plays");
                setSelectedChannel(null);
                setSelectedCategory(null);
                setSelectedBrand(null);
              }}
              className="flex items-center gap-2"
            >
              Switch to {dataType === "plays" ? "Seconds" : "Plays"}
            </Button>
          </div>
          {(selectedChannel || selectedCategory || selectedBrand) && (
            <Button onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to{" "}
              {selectedBrand
                ? "Brands"
                : selectedCategory
                ? "Categories"
                : "Sectors"}
            </Button>
          )}
        </div>
      }
      chart={
        data.length === 0 ? (
          <div className="flex items-center justify-center h-[600px] text-gray-500">
            No data available for the selected {getCurrentLevel()}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={600}>
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={16 / 9}
              stroke="#fff"
              content={<CustomizedContent />}
              animationEasing="ease-out"
            >
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "white", strokeWidth: 2 }}
              />
            </Treemap>
          </ResponsiveContainer>
        )
      }
      footer={
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span
            className={`hover:text-primary cursor-pointer ${
              !selectedChannel ? "text-primary font-medium" : ""
            }`}
            onClick={() => {
              setSelectedChannel(null);
              setSelectedCategory(null);
              setSelectedBrand(null);
            }}
          >
            Sectors
          </span>
          {selectedChannel && (
            <>
              <span>→</span>
              <span
                className={`hover:text-primary cursor-pointer ${
                  selectedChannel && !selectedCategory
                    ? "text-primary font-medium"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                }}
              >
                {selectedChannel}
              </span>
            </>
          )}
          {selectedCategory && (
            <>
              <span>→</span>
              <span
                className={`hover:text-primary cursor-pointer ${
                  selectedCategory && !selectedBrand
                    ? "text-primary font-medium"
                    : ""
                }`}
                onClick={() => {
                  setSelectedBrand(null);
                }}
              >
                {selectedCategory}
              </span>
            </>
          )}
          {selectedBrand && (
            <>
              <span>→</span>
              <span className="text-primary font-medium">{selectedBrand}</span>
            </>
          )}
        </div>
      }
    />
  );
};

export default TVChannelTreemap;