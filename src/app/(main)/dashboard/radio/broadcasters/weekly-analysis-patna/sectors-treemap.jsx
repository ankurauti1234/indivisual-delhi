import React, { useState, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Tv, Filter } from "lucide-react";
import ChartCard from "@/components/card/charts-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sectorData } from "./treemap-sector-data";
import { sectorSecondsData } from "./treemap-sector-seconds-data";

// Define sector colors
const SECTOR_COLORS = {
  "ACCESSORIES": { name: "Accessories", color: "#34D399" },
  "AGRICULTURE": { name: "Agriculture", color: "#4ADE80" },
  "ANIMAL HUSBANDRY": { name: "Animal Husbandry", color: "#F59E0B" },
  "AUTOMOBILE": { name: "Automobile", color: "#F472B6" },
  "CONSTRUCTIONS": { name: "Constructions", color: "#FB923C" },
  "CONSUMER DURABLES": { name: "Consumer Durables", color: "#3B82F6" },
  "E-COMMERCE": { name: "E-Commerce", color: "#EC4899" },
  "EDUCATION": { name: "Education", color: "#4ADE80" },
  "ENTERTAINMENT": { name: "Entertainment", color: "#F87171" },
  "FINANCE": { name: "Finance", color: "#60A5FA" },
  "FMCG": { name: "FMCG", color: "#A78BFA" },
  "HEALTHCARE": { name: "Healthcare", color: "#10B981" },
  "HOME FURNISHING": { name: "Home Furnishing", color: "#E879F9" },
  "INFRASTRUCTURE": { name: "Infrastructure", color: "#FB923C" },
  "PERSONAL CARE": { name: "Personal Care", color: "#F87171" },
  "PROPERTY": { name: "Property", color: "#FBBF24" },
  "PUBLIC INTEREST": { name: "Public Interest", color: "#93C5FD" },
  "RENEWABLE ENERGY": { name: "Renewable Energy", color: "#6EE7B7" },
  "TELECOMMUNICATION": { name: "Telecommunication", color: "#22D3EE" },
  "TEXTILES&APPARELS": { name: "Textiles & Apparels", color: "#FCA5A5" },
  "TRAVEL&TOURISM": { name: "Travel & Tourism", color: "#FDBA74" }
};

const TVChannelTreemap = () => {
  const [selectedWeek, setSelectedWeek] = useState("week19");
  const [selectedStation, setSelectedStation] = useState("Radio City");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dataType, setDataType] = useState("plays");

  const weeks = [
    { value: "week19", label: "Week 19 (May 07-13, 2025)" },
    { value: "week20", label: "Week 20 (May 14-20, 2025)" },
  ];
  const stations = ["Radio City", "Radio Mirchi", "Red FM", "Big FM"];

  const getCurrentLevel = () => {
    if (selectedCategory) return "categories";
    if (selectedChannel) return "categories";
    return "channels";
  };

  const getTitle = () => {
    const weekDisplay = weeks.find((w) => w.value === selectedWeek)?.label || selectedWeek;
    const metric = dataType === "plays" ? "Plays" : "Seconds";
    if (selectedCategory) return `${selectedCategory} ${metric} (${weekDisplay})`;
    if (selectedChannel) return `${selectedChannel} Categories ${metric} (${weekDisplay})`;
    return `Market ${metric} by Sector (${weekDisplay} - ${selectedStation})`;
  };

  const getData = useMemo(() => {
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (selectedCategory) {
      const brands = data[selectedChannel]?.categories?.[selectedCategory]?.brands || {};
      // Use the category's color or fallback to channel's color
      const categoryColor =
        SECTOR_COLORS[selectedCategory.toUpperCase()]?.color ||
        SECTOR_COLORS[selectedChannel.toUpperCase()]?.color ||
        "#CCCCCC"; // Fallback color
      return Object.entries(brands).map(([name, brandData]) => ({
        name,
        size: brandData.sum || 0,
        color: categoryColor,
      }));
    }
    if (selectedChannel) {
      const categories = data[selectedChannel]?.categories || {};
      // Use the channel's color for categories
      const channelColor = SECTOR_COLORS[selectedChannel.toUpperCase()]?.color || "#CCCCCC";
      return Object.entries(categories).map(([name]) => ({
        name,
        size: categories[name].sum || 0,
        color: SECTOR_COLORS[name.toUpperCase()]?.color || channelColor,
      }));
    }
    // Top-level channels (sectors)
    return Object.entries(data).map(([name, channelData]) => ({
      name,
      size: channelData.sum || 0,
      color: SECTOR_COLORS[name.toUpperCase()]?.color || "#CCCCCC", // Fallback color
    }));
  }, [selectedWeek, selectedStation, selectedChannel, selectedCategory, dataType]);

  const getInnerContent = (name) => {
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};
    const level = getCurrentLevel();

    if (level === "channels" && data[name]?.categories) {
      return Object.entries(data[name].categories).map(([catName, catData]) => ({
        name: catName,
        size: catData.sum || 0,
      }));
    }
    if (level === "categories" && !selectedCategory && data[selectedChannel]?.categories?.[name]?.brands) {
      return Object.entries(data[selectedChannel].categories[name].brands).map(([brandName, brandData]) => ({
        name: brandName,
        size: brandData.sum || 0,
      }));
    }
    return [];
  };

  const handleClick = (name) => {
    const level = getCurrentLevel();
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (level === "channels" && data[name]?.categories) {
      setSelectedChannel(name);
      setSelectedCategory(null);
    } else if (level === "categories" && data[selectedChannel]?.categories?.[name]?.brands) {
      setSelectedCategory(name);
    }
  };

  const handleNavigation = (level) => {
    if (level === "channels") {
      setSelectedChannel(null);
      setSelectedCategory(null);
    } else if (level === "categories") {
      setSelectedCategory(null);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
  };

  const CustomizedContent = ({ x, y, width, height, name, size, color }) => {
    const isHovered = hoveredItem === name;
    const display = width > 30 && height > 30;
    const level = getCurrentLevel();
    const fontSize = Math.min(width / 6, height / 5, 12);
    const isClickable = level === "channels" || (level === "categories" && !selectedCategory);
    const safeName = (name || "").replace(/\s/g, "-");

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => isClickable && handleClick(name)}
        style={{ cursor: isClickable ? "pointer" : "default" }}
        aria-label={`Treemap item: ${name || ""}, ${dataType === "plays" ? `${size} Plays` : `${size}s`}`}
      >
        <defs>
          <linearGradient id={`grad-${safeName}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: `${color}CC`, stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#grad-${safeName})`}
          style={{
            transition: "all 0.3s ease-in-out",
            transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
            boxShadow: isHovered ? "inset 0 0 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)" : "none",
          }}
          rx={4}
          ry={4}
          stroke="white"
          strokeWidth={1}
        />
        {display && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: "600",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <tspan x={x + width / 2} dy="-0.6em">
              {truncateText(name || "", Math.floor(width / (fontSize / 2)))}
            </tspan>
            <tspan
              x={x + width / 2}
              dy="1.3em"
              style={{
                fontSize: `${fontSize * 0.85}px`,
                fontWeight: "400",
              }}
            >
              {/* {dataType === "plays" ? `${size} Plays` : `${size}s`} */}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const innerContent = getInnerContent(data.name);
      return (
        <div className="bg-popover p-3 rounded-md shadow-lg border border-border max-w-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <h3 className="text-sm font-semibold text-foreground">{data.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {dataType === "plays" ? `Plays: ${data.size}` : `Duration: ${data.size}s`}
          </p>
          {innerContent.length > 0 && (
            <div className="border-t border-border pt-2">
              <p className="text-xs font-medium text-foreground mb-1">
                {getCurrentLevel() === "channels" ? "Categories" : "Brands"}:
              </p>
              <ul className="space-y-1 max-h-40 overflow-auto">
                {innerContent.map((item, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    {item.name}: {dataType === "plays" ? `${item.size} Plays` : `${item.size}s`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<Tv className="w-6 h-6 text-primary" />}
      title={getTitle()}
      description="Explore market share distribution across sectors and categories"
      action={
        <div className="flex w-full justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select
              value={selectedWeek}
              onValueChange={(value) => {
                setSelectedWeek(value);
                setSelectedChannel(null);
                setSelectedCategory(null);
              }}
            >
              <SelectTrigger className="w-52 bg-popover shadow-sm border-border rounded-md">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg bg-popover">
                {weeks.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStation}
              onValueChange={(value) => {
                setSelectedStation(value);
                setSelectedChannel(null);
                setSelectedCategory(null);
              }}
            >
              <SelectTrigger className="w-52 bg-popover shadow-sm border-border rounded-md">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg bg-popover">
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={dataType}
              onValueChange={(value) => {
                if (value) {
                  setDataType(value);
                  setSelectedChannel(null);
                  setSelectedCategory(null);
                }
              }}
              className="flex gap-2"
            >
              <ToggleGroupItem
                value="plays"
                className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
              >
                Plays
              </ToggleGroupItem>
              <ToggleGroupItem
                value="seconds"
                className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
              >
                Seconds
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      }
      chart={
        getData.length === 0 ? (
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            No data available for the selected {getCurrentLevel()}. Try another week or station.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <span
                className={`hover:text-primary cursor-pointer ${!selectedChannel ? "text-primary font-medium" : ""}`}
                onClick={() => handleNavigation("channels")}
                aria-label="Navigate to Sectors"
              >
                Sectors
              </span>
              {selectedChannel && (
                <>
                  <span>→</span>
                  <span
                    className={`hover:text-primary cursor-pointer ${selectedChannel && !selectedCategory ? "text-primary font-medium" : ""}`}
                    onClick={() => handleNavigation("categories")}
                    aria-label={`Navigate to ${selectedChannel}`}
                  >
                    {selectedChannel}
                  </span>
                </>
              )}
              {selectedCategory && (
                <>
                  <span>→</span>
                  <span className="text-primary font-medium">{selectedCategory}</span>
                </>
              )}
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <Treemap
                data={getData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
                animationEasing="ease-in-out"
                animationDuration={500}
              >
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "white", strokeWidth: 1 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </>
        )
      }
    />
  );
};

export default TVChannelTreemap;