import React, { useState, useMemo } from "react";
import { Radio, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const RadioCitySectorData = [
  {
    "week": "week_1",
    "seconds": {
      "EDUCATION": 19335,
      "ENTERTAINMENT": 16943,
      "HEALTHCARE": 15783,
      "FMCG": 13866,
      "AUTOMOBILE": 12155,
      "FINANCE": 9052,
      "CONSUMER DURABLES": 7112,
      "ACCESSORIES": 6442,
      "PROPERTY": 3172,
      "EVENTS": 2807,
      "TEXTILES&APPARELS": 740,
      "PUBLIC INTEREST": 669,
      "TRAVEL&TOURISM": 300
    },
    "plays": {
      "EDUCATION": 1094,
      "ENTERTAINMENT": 1509,
      "HEALTHCARE": 620,
      "FMCG": 975,
      "AUTOMOBILE": 799,
      "FINANCE": 547,
      "CONSUMER DURABLES": 501,
      "ACCESSORIES": 573,
      "PROPERTY": 350,
      "EVENTS": 104,
      "TEXTILES&APPARELS": 148,
      "PUBLIC INTEREST": 42,
      "TRAVEL&TOURISM": 20
    }
  }
]

const RedFMSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "EDUCATION": 18979,
      "AUTOMOBILE": 15476,
      "FINANCE": 14891,
      "PROPERTY": 10059,
      "FMCG": 9387,
      "HEALTHCARE": 9106,
      "CONSUMER DURABLES": 8700,
      "ENTERTAINMENT": 7208,
      "ACCESSORIES": 5830,
      "PUBLIC INTEREST": 3585,
      "HOME FURNISHING": 3025,
      "TEXTILES&APPARELS": 920,
      "PETROLEUM PRODUCTS": 270,
      "AGRICULTURE": 18
    },
    "plays": {
      "EDUCATION": 1133,
      "AUTOMOBILE": 795,
      "FINANCE": 718,
      "PROPERTY": 642,
      "FMCG": 569,
      "HEALTHCARE": 364,
      "CONSUMER DURABLES": 450,
      "ENTERTAINMENT": 441,
      "ACCESSORIES": 501,
      "PUBLIC INTEREST": 120,
      "HOME FURNISHING": 166,
      "TEXTILES&APPARELS": 46,
      "PETROLEUM PRODUCTS": 18,
      "AGRICULTURE": 2
    }
  }
]

const RadioOneSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "ENTERTAINMENT": 8419,
      "FINANCE": 6709,
      "FMCG": 6269,
      "AUTOMOBILE": 4863,
      "HEALTHCARE": 3240,
      "TRAVEL&TOURISM": 2681,
      "CONSUMER DURABLES": 2515,
      "PUBLIC INTEREST": 1941,
      "EVENTS": 1848,
      "PROPERTY": 1629,
      "E-COMMERCE": 975,
      "EDUCATION": 660,
      "RETAIL": 180
    },
    "plays": {
      "ENTERTAINMENT": 211,
      "FINANCE": 338,
      "FMCG": 638,
      "AUTOMOBILE": 265,
      "HEALTHCARE": 108,
      "TRAVEL&TOURISM": 78,
      "CONSUMER DURABLES": 124,
      "PUBLIC INTEREST": 74,
      "EVENTS": 168,
      "PROPERTY": 166,
      "E-COMMERCE": 14,
      "EDUCATION": 44,
      "RETAIL": 9
    }
  }
]

const RadioMirchiSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "AUTOMOBILE": 21906,
      "EDUCATION": 18770,
      "FMCG": 16149,
      "CONSUMER DURABLES": 10451,
      "FINANCE": 10402,
      "HEALTHCARE": 8191,
      "PROPERTY": 7829,
      "ENTERTAINMENT": 4180,
      "PUBLIC INTEREST": 3404,
      "HOME FURNISHING": 2174,
      "ACCESSORIES": 2020,
      "EVENTS": 1680,
      "E-COMMERCE": 1525,
      "TECHNOLOGY": 780,
      "PERSONAL CARE": 775,
      "TEXTILES&APPARELS": 360,
      "PETROLEUM PRODUCTS": 270,
      "BUSINESS": 90
    },
    "plays": {
      "AUTOMOBILE": 1080,
      "EDUCATION": 1075,
      "FMCG": 964,
      "CONSUMER DURABLES": 571,
      "FINANCE": 416,
      "HEALTHCARE": 380,
      "PROPERTY": 500,
      "ENTERTAINMENT": 627,
      "PUBLIC INTEREST": 162,
      "HOME FURNISHING": 116,
      "ACCESSORIES": 101,
      "EVENTS": 112,
      "E-COMMERCE": 99,
      "TECHNOLOGY": 77,
      "PERSONAL CARE": 31,
      "TEXTILES&APPARELS": 18,
      "PETROLEUM PRODUCTS": 18,
      "BUSINESS": 6
    }
  }
]

const RadioSectorAnalysis = () => {
  const [selectedWeeks, setSelectedWeeks] = useState(["week_1"]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [dataType, setDataType] = useState("seconds");

  // Define sectors with colors
const sectors = {
  ACCESSORIES: { name: "Accessories", color: "#34D399" },
  AGRICULTURE: { name: "Agriculture", color: "#60A5FA" },
  AUTOMOBILE: { name: "Automobile", color: "#F472B6" },
  BUSINESS: { name: "Business", color: "#A78BFA" },
  "CONSUMER DURABLES": { name: "Consumer Durables", color: "#3B82F6" },
  "E-COMMERCE": { name: "E-Commerce", color: "#4ADE80" },
  EDUCATION: { name: "Education", color: "#F87171" },
  ENTERTAINMENT: { name: "Entertainment", color: "#2DD4BF" },
  EVENTS: { name: "Events", color: "#FB923C" },
  FINANCE: { name: "Finance", color: "#D946EF" },
  FMCG: { name: "FMCG", color: "#22D3EE" },
  HEALTHCARE: { name: "Healthcare", color: "#E879F9" },
  "HOME FURNISHING": { name: "Home Furnishing", color: "#FCA5A5" },
  "PERSONAL CARE": { name: "Personal Care", color: "#5EEAD4" },
  "PETROLEUM PRODUCTS": { name: "Petroleum Products", color: "#EAB308" },
  PROPERTY: { name: "Property", color: "#EF4444" },
  "PUBLIC INTEREST": { name: "Public Interest", color: "#38BDF8" },
  RETAIL: { name: "Retail", color: "#34D399" },
  TECHNOLOGY: { name: "Technology", color: "#A78BFA" },
  "TEXTILES&APPARELS": { name: "Textiles & Apparels", color: "#F472B6" },
  "TRAVEL&TOURISM": { name: "Travel & Tourism", color: "#3B82F6" },
};


  // Define weeks
  const weeks = [
    { value: "week_1", label: "Week 19 (May 7-14, 2025)", shortLabel: "Week 19" },
  ];

  // Define stations
  const stations = [
    { value: "all", label: "All Stations" },
    { value: "radiocity", label: "Radio City" },
    { value: "redfm", label: "Red FM" },
    { value: "radioone", label: "Radio One" },
    { value: "radiomirchi", label: "Radio Mirchi" },
  ];

  // Combine and normalize data
  const rawData = {
    "Radio City": {
      region: "Delhi",
      language: "Hindi",
      weekly: Object.fromEntries(
        RadioCitySectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    "Red FM": {
      region: "Delhi",
      language: "Hindi",
      weekly: Object.fromEntries(
        RedFMSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    "Radio One": {
      region: "Delhi",
      language: "Hindi",
      weekly: Object.fromEntries(
        RadioOneSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    "Radio Mirchi": {
      region: "Delhi",
      language: "Hindi",
      weekly: Object.fromEntries(
        RadioMirchiSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
  };

  // Convert nested data structure to flat array for filtering
  const flattenedData = Object.entries(rawData).map(([station, data]) => ({
    station,
    ...data,
  }));

  // Filter data based on selected stations and weeks
  const filteredData = useMemo(() => {
    const isAllSelected = selectedStations.includes("all");
    return flattenedData
      .filter((stationData) =>
        isAllSelected || selectedStations.includes(stationData.station.toLowerCase())
      )
      .map((stationData) => ({
        station: stationData.station,
        weeklyData: selectedWeeks.map((week) => ({
          week,
          sectors: stationData.weekly[week]?.[dataType] || {},
        })),
        region: stationData.region,
        language: stationData.language,
      }));
  }, [selectedWeeks, selectedStations, dataType]);

  const formatSelectedWeeks = () => {
    if (selectedWeeks.length === 0) return "Select week";
    return selectedWeeks
      .map((week) => weeks.find((w) => w.value === week)?.shortLabel)
      .join(", ");
  };

  const formatSelectedStations = (selected) => {
    if (selected.length === 0) return "Select stations";
    if (selected.includes("all")) return "All Stations";
    return selected
      .map((station) => stations.find((s) => s.value === station)?.label || station)
      .join(", ");
  };

  const handleWeekSelection = (value) => {
    setSelectedWeeks((prev) =>
      prev.includes(value)
        ? prev.filter((week) => week !== value)
        : [...prev, value]
    );
  };

  const handleStationSelection = (value) => {
    if (value === "all") {
      setSelectedStations(["all"]);
    } else {
      setSelectedStations((prev) => {
        const newSelection = prev.includes(value)
          ? prev.filter((station) => station !== value)
          : [...prev.filter((station) => station !== "all"), value];
        return newSelection.length === 0 ? ["all"] : newSelection;
      });
    };
  };

  const formatValue = (value) => {
    if (dataType === "seconds") {
      return `${Math.round(value)}s`;
    }
    return `${Math.round(value)}`;
  };

  return (
    <Card className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 shadow-md">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Sector-wise Ad Distribution
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Analyze sector performance for selected stations
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2">
                <Select value="" onValueChange={handleWeekSelection}>
                  <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                    <SelectValue placeholder={formatSelectedWeeks()} />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((week) => (
                      <SelectItem
                        key={week.value}
                        value={week.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWeeks.includes(week.value)}
                          onChange={() => handleWeekSelection(week.value)}
                          className="mr-2"
                        />
                        {week.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value="" onValueChange={handleStationSelection}>
                  <SelectTrigger className="w-48 bg-white shadow-sm border-gray-200">
                    <SelectValue placeholder={formatSelectedStations(selectedStations)} />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem
                        key={station.value}
                        value={station.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStations.includes(station.value)}
                          onChange={() => handleStationSelection(station.value)}
                          className="mr-2"
                        />
                        {station.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ToggleGroup
                  type="single"
                  value={dataType}
                  onValueChange={(value) => value && setDataType(value)}
                  className="flex gap-2"
                >
                  <ToggleGroupItem
                    value="seconds"
                    className="bg-white shadow-sm border-gray-200 px-4 py-2 rounded-md data-[state=on]:bg-primary data-[state=on]:text-white"
                  >
                    Seconds
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="plays"
                    className="bg-white shadow-sm border-gray-200 px-4 py-2 rounded-md data-[state=on]:bg-primary data-[state=on]:text-white"
                  >
                    Plays
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(sectors).map(([key, sector]) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 shadow-sm"
            >
              <div
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-gray-700">
                {sector.name}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {filteredData.map((station) => (
            <div
              key={station.station}
              className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-36 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-800">
                    {station.station}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{station.region}</div>
                  <div className="text-xs text-gray-500">{station.language}</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-3">
                    {station.weeklyData.map((weekData) => {
                      const totalWeekValue = Object.values(weekData.sectors).reduce(
                        (sum, value) => sum + (value || 0),
                        0
                      );
                      if (totalWeekValue === 0) {
                        return (
                          <div key={weekData.week} className="relative">
                            <div className="text-xs font-medium text-gray-600 mb-1.5">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              No data available
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={weekData.week} className="relative">
                          <div className="text-xs font-medium text-gray-600 mb-1.5">
                            {weeks.find((w) => w.value === weekData.week)?.label}
                          </div>
                          <div className="relative h-8 w-full">
                            <div className="absolute inset-y-0 w-full bg-gray-200/50 rounded-full" />
                            <div
                              className="relative h-full rounded-full flex shadow-sm"
                              style={{ width: "100%" }}
                            >
                              {Object.entries(weekData.sectors)
                                .filter(([, value]) => value > 0)
                                .map(([sectorKey, value]) => {
                                  const barWidth = (value / totalWeekValue) * 100;
                                  return (
                                    <div
                                      key={sectorKey}
                                      className="h-full flex items-center justify-center group transition-all duration-200 hover:brightness-110 relative"
                                      style={{
                                        width: `${barWidth}%`,
                                        backgroundColor:
                                          sectors[sectorKey]?.color || "#CCCCCC",
                                        minWidth: value > 0 ? "20px" : "0px",
                                      }}
                                    >
                                      <div className="text-xs font-medium text-white px-1 truncate">
                                        {formatValue(value)}
                                      </div>
                                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {sectors[sectorKey]?.name || sectorKey}:{" "}
                                        {formatValue(value)}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioSectorAnalysis;