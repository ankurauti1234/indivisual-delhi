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

const FeverFmSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "PROPERTY": 36195,
      "EDUCATION": 13522,
      "ENTERTAINMENT": 11405,
      "FINANCE": 11281,
      "PUBLIC INTEREST": 10187,
      "AUTOMOBILE": 7568,
      "HEALTHCARE": 5784,
      "FMCG": 5409,
      "ACCESSORIES": 5134,
      "CONSTRUCTION": 1856,
      "EVENTS": 1223,
      "PETROLEUM PRODUCTS": 411,
      "INFRASTRUCTURE": 114,
      "LOGISTICS": 40
    },
    "plays": {
      "PROPERTY": 2062,
      "EDUCATION": 639,
      "ENTERTAINMENT": 511,
      "FINANCE": 401,
      "PUBLIC INTEREST": 256,
      "AUTOMOBILE": 365,
      "HEALTHCARE": 289,
      "FMCG": 242,
      "ACCESSORIES": 434,
      "CONSTRUCTION": 56,
      "EVENTS": 62,
      "PETROLEUM PRODUCTS": 19,
      "INFRASTRUCTURE": 6,
      "LOGISTICS": 1
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
  const [highlightedSector, setHighlightedSector] = useState(null);

const sectors = {
  ACCESSORIES: { name: "Accessories", color: "#34D399" },
  AUTOMOBILE: { name: "Automobile", color: "#F472B6" },
  CONSTRUCTION: { name: "Construction", color: "#FB923C" },
  EDUCATION: { name: "Education", color: "#4ADE80" },
  ENTERTAINMENT: { name: "Entertainment", color: "#F87171" },
  EVENTS: { name: "Events", color: "#FB923C" },
  FINANCE: { name: "Finance", color: "#60A5FA" },
  FMCG: { name: "FMCG", color: "#A78BFA" },
  HEALTHCARE: { name: "Healthcare", color: "#10B981" },
  INFRASTRUCTURE: { name: "Infrastructure", color: "#F59E0B" },
  LOGISTICS: { name: "Logistics", color: "#3B82F6" },
  "PETROLEUM PRODUCTS": { name: "Petroleum Products", color: "#6EE7B7" },
  PROPERTY: { name: "Property", color: "#FBBF24" },
  "PUBLIC INTEREST": { name: "Public Interest", color: "#93C5FD" }
};

  const weeks = [
    { value: "week_1", label: "Week 25 (June 16-22, 2025)", shortLabel: "Week 25" },
  ];

  const stations = [
    { value: "all", label: "All Stations" },
    { value: "feverfm", label: "Fever FM" },
  ];

  const rawData = {
    "Fever FM": {
      region: "Delhi",
      language: "Hindi",
      weekly: Object.fromEntries(
        FeverFmSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
  };

  const flattenedData = Object.entries(rawData).map(([station, data]) => ({
    station,
    ...data,
  }));

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

  const formatSelectedWeeks = (selected) => {
    if (selected.length === 0) return "Select weeks";
    return selected
      .map((week) => weeks.find((w) => w.value === week)?.shortLabel)
      .sort(
        (a, b) =>
          weeks.findIndex((w) => w.shortLabel === a) -
          weeks.findIndex((w) => w.shortLabel === b)
      )
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
    }
  };

  const formatValue = (value) => {
    if (dataType === "seconds") {
      return `${Math.round(value)}s`;
    }
    return `${Math.round(value)}`;
  };

  const toggleSectorHighlight = (sectorKey) => {
    setHighlightedSector((prev) => (prev === sectorKey ? null : sectorKey));
  };

  return (
    <Card className="w-full bg-card shadow-lg rounded-lg border border-border">
      <CardHeader className="p-6 border-b">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2 shadow-md">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Sector-wise Ad Distribution
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Interactive sector performance across radio stations
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-2 flex-wrap">
                <Select value="" onValueChange={handleWeekSelection}>
                  <SelectTrigger className="w-40 bg-popover shadow-sm border-border rounded-md">
                    <SelectValue placeholder={formatSelectedWeeks(selectedWeeks)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg bg-popover">
                    {weeks.map((week) => (
                      <SelectItem
                        key={week.value}
                        value={week.value}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWeeks.includes(week.value)}
                          onChange={() => handleWeekSelection(week.value)}
                          className="h-4 w-4"
                        />
                        {week.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value="" onValueChange={handleStationSelection}>
                  <SelectTrigger className="w-48 bg-popover shadow-sm border-border rounded-md">
                    <SelectValue placeholder={formatSelectedStations(selectedStations)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg bg-popover">
                    {stations.map((station) => (
                      <SelectItem
                        key={station.value}
                        value={station.value}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStations.includes(station.value)}
                          onChange={() => handleStationSelection(station.value)}
                          className="h-4 w-4"
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
                    className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
                  >
                    Seconds
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="plays"
                    className="bg-popover shadow-sm border-blue-400 px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-blue-600 data-[state=on]:text-primary-foreground hover:bg-muted"
                  >
                    Plays
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-card">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.entries(sectors).map(([key, sector]) => (
            <button
              key={key}
              onClick={() => toggleSectorHighlight(key)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 shadow-full transition-colors duration-200 ${
                highlightedSector === key
                  ? "bg-accent ring-2 ring-blue-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div
                className="h-2.5 w-2.5 rounded-full ring-1 ring-gray-300"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-gray-800">
                {sector.name}
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {filteredData.map((station) => (
            <div
              key={station.station}
              className="bg-card rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-36 flex-shrink-0">
                  <div className="text-sm font-semibold text-foreground">
                    {station.station}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{station.region}</div>
                  <div className="text-xs text-muted-foreground">{station.language}</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    {station.weeklyData.map((weekData) => {
                      const totalWeekValue = Object.values(weekData.sectors).reduce(
                        (sum, value) => sum + (value || 0),
                        0
                      );
                      if (totalWeekValue === 0) {
                        return (
                          <div key={weekData.week} className="relative">
                            <div className="text-md font-medium text-foreground mb-2">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-md text-muted-foreground">
                              No data available
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={weekData.week} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-md font-medium text-foreground">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-md font-semibold text-foreground">
                              Total: {formatValue(totalWeekValue)}
                            </div>
                          </div>
                          <div className="relative h-10 w-full">
                            <div className="absolute inset-y-0 w-full bg-muted rounded-md shadow-inner" />
                            <div
                              className="relative h-full rounded-md flex shadow-sm"
                              style={{ width: "100%" }}
                            >
                              {Object.entries(weekData.sectors)
                                .filter(([, value]) => value > 0)
                                .sort(([, a], [, b]) => b - a)
                                .map(([sectorKey, value]) => {
                                  const barWidth = (value / totalWeekValue) * 100;
                                  const percentage = ((value / totalWeekValue) * 100).toFixed(1);
                                  const isHighlighted =
                                    highlightedSector === null || highlightedSector === sectorKey;
                                  return (
                                    <div
                                      key={sectorKey}
                                      className="h-full flex items-center justify-center group transition-all duration-200 hover:scale-105"
                                      style={{
                                        width: `${barWidth}%`,
                                        backgroundColor: sectors[sectorKey]?.color || "#CCCCCC",
                                        minWidth: value > 0 ? "24px" : "0px",
                                        opacity: isHighlighted ? 1 : 0.1,
                                        transformOrigin: "center",
                                        boxShadow: isHighlighted
                                          ? "inset 0 0 6px rgba(0,0,0,0.15)"
                                          : "none",
                                      }}
                                    >
                                      <div className="text-md font-semibold text-white px-1.5 truncate drop-shadow">
                                        {formatValue(value)}
                                      </div>
                                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2.5 py-1 bg-background text-foreground text-md rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                        {sectors[sectorKey]?.name || sectorKey}: {formatValue(value)} ({percentage}%)
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