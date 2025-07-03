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

const BigSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "FMCG": 18704,
      "HEALTHCARE": 10230,
      "FINANCE": 9286,
      "EDUCATION": 7692,
      "AUTOMOBILE": 7397,
      "HOME FURNISHING": 4522,
      "ENTERTAINMENT": 4436,
      "PUBLIC INTEREST": 3993,
      "CONSTRUCTIONS": 3393,
      "INFRASTRUCTURE": 2317,
      "CONSUMER DURABLES": 1651,
      "E-COMMERCE": 1092,
      "RENEWABLE ENERGY": 510,
      "ANIMAL HUSBANDRY": 376
    },
    "plays": {
      "FMCG": 1718,
      "HEALTHCARE": 590,
      "FINANCE": 765,
      "EDUCATION": 372,
      "AUTOMOBILE": 502,
      "HOME FURNISHING": 199,
      "ENTERTAINMENT": 335,
      "PUBLIC INTEREST": 178,
      "CONSTRUCTIONS": 307,
      "INFRASTRUCTURE": 331,
      "CONSUMER DURABLES": 262,
      "E-COMMERCE": 84,
      "RENEWABLE ENERGY": 45,
      "ANIMAL HUSBANDRY": 31
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "FMCG": 18189,
      "HEALTHCARE": 12371,
      "EDUCATION": 12103,
      "FINANCE": 7145,
      "AUTOMOBILE": 4700,
      "PUBLIC INTEREST": 4605,
      "HOME FURNISHING": 3601,
      "CONSTRUCTIONS": 3174,
      "ENTERTAINMENT": 3138,
      "INFRASTRUCTURE": 1848,
      "CONSUMER DURABLES": 1522,
      "E-COMMERCE": 1092,
      "TELECOMMUNICATION": 820,
      "TEXTILES&APPARELS": 480,
      "ANIMAL HUSBANDRY": 370
    },
    "plays": {
      "FMCG": 1666,
      "HEALTHCARE": 718,
      "EDUCATION": 569,
      "FINANCE": 709,
      "AUTOMOBILE": 388,
      "PUBLIC INTEREST": 187,
      "HOME FURNISHING": 164,
      "CONSTRUCTIONS": 287,
      "ENTERTAINMENT": 302,
      "INFRASTRUCTURE": 264,
      "CONSUMER DURABLES": 243,
      "E-COMMERCE": 84,
      "TELECOMMUNICATION": 40,
      "TEXTILES&APPARELS": 30,
      "ANIMAL HUSBANDRY": 35
    }
  }
]

const RedSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "AUTOMOBILE": 14151,
      "EDUCATION": 9625,
      "PUBLIC INTEREST": 8863,
      "FMCG": 6840,
      "FINANCE": 6747,
      "HEALTHCARE": 5851,
      "PERSONAL CARE": 2625,
      "TELECOMMUNICATION": 1800,
      "CONSTRUCTIONS": 1400,
      "ANIMAL HUSBANDRY": 1183,
      "INFRASTRUCTURE": 1110,
      "ENTERTAINMENT": 931,
      "AGRICULTURE": 700,
      "CONSUMER DURABLES": 690,
      "TEXTILES&APPARELS": 590,
      "RENEWABLE ENERGY": 450,
      "HOME FURNISHING": 217
    },
    "plays": {
      "AUTOMOBILE": 689,
      "EDUCATION": 529,
      "PUBLIC INTEREST": 228,
      "FMCG": 573,
      "FINANCE": 309,
      "HEALTHCARE": 378,
      "PERSONAL CARE": 75,
      "TELECOMMUNICATION": 72,
      "CONSTRUCTIONS": 70,
      "ANIMAL HUSBANDRY": 196,
      "INFRASTRUCTURE": 74,
      "ENTERTAINMENT": 32,
      "AGRICULTURE": 35,
      "CONSUMER DURABLES": 35,
      "TEXTILES&APPARELS": 59,
      "RENEWABLE ENERGY": 45,
      "HOME FURNISHING": 11
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "EDUCATION": 18557,
      "AUTOMOBILE": 17265,
      "PUBLIC INTEREST": 10036,
      "FMCG": 8115,
      "FINANCE": 6303,
      "CONSUMER DURABLES": 4320,
      "PERSONAL CARE": 4165,
      "HEALTHCARE": 2868,
      "TELECOMMUNICATION": 2450,
      "CONSTRUCTIONS": 1739,
      "ANIMAL HUSBANDRY": 1480,
      "INFRASTRUCTURE": 1110,
      "AGRICULTURE": 744,
      "ENTERTAINMENT": 682,
      "RENEWABLE ENERGY": 580,
      "TEXTILES&APPARELS": 405,
      "HOME FURNISHING": 60
    },
    "plays": {
      "EDUCATION": 971,
      "AUTOMOBILE": 856,
      "PUBLIC INTEREST": 257,
      "FMCG": 700,
      "FINANCE": 351,
      "CONSUMER DURABLES": 160,
      "PERSONAL CARE": 119,
      "HEALTHCARE": 309,
      "TELECOMMUNICATION": 98,
      "CONSTRUCTIONS": 87,
      "ANIMAL HUSBANDRY": 264,
      "INFRASTRUCTURE": 46,
      "AGRICULTURE": 37,
      "ENTERTAINMENT": 53,
      "RENEWABLE ENERGY": 58,
      "TEXTILES&APPARELS": 27,
      "HOME FURNISHING": 3
    }
  }
]

const RadioCitySectorData = [
  {
    "week": "week_1",
    "seconds": {
      "FMCG": 16222,
      "HEALTHCARE": 13512,
      "FINANCE": 10461,
      "CONSUMER DURABLES": 10250,
      "EDUCATION": 9027,
      "AUTOMOBILE": 8326,
      "PUBLIC INTEREST": 6839,
      "ENTERTAINMENT": 6138,
      "HOME FURNISHING": 4251,
      "CONSTRUCTIONS": 2790,
      "PROPERTY": 2551,
      "ANIMAL HUSBANDRY": 2052,
      "AGRICULTURE": 1518,
      "ACCESSORIES": 1511,
      "TRAVEL&TOURISM": 10
    },
    "plays": {
      "FMCG": 1731,
      "HEALTHCARE": 1116,
      "FINANCE": 789,
      "CONSUMER DURABLES": 728,
      "EDUCATION": 635,
      "AUTOMOBILE": 980,
      "PUBLIC INTEREST": 206,
      "ENTERTAINMENT": 302,
      "HOME FURNISHING": 197,
      "CONSTRUCTIONS": 292,
      "PROPERTY": 355,
      "ANIMAL HUSBANDRY": 133,
      "AGRICULTURE": 58,
      "ACCESSORIES": 72,
      "TRAVEL&TOURISM": 1
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "EDUCATION": 16467,
      "FMCG": 14907,
      "HEALTHCARE": 12698,
      "FINANCE": 10367,
      "PUBLIC INTEREST": 8666,
      "ENTERTAINMENT": 7332,
      "AUTOMOBILE": 6621,
      "CONSUMER DURABLES": 6131,
      "HOME FURNISHING": 3602,
      "PROPERTY": 2778,
      "CONSTRUCTIONS": 2687,
      "AGRICULTURE": 1399,
      "ACCESSORIES": 1029,
      "ANIMAL HUSBANDRY": 1004,
      "TEXTILES&APPARELS": 410
    },
    "plays": {
      "EDUCATION": 1006,
      "FMCG": 1682,
      "HEALTHCARE": 1157,
      "FINANCE": 709,
      "PUBLIC INTEREST": 258,
      "ENTERTAINMENT": 300,
      "AUTOMOBILE": 825,
      "CONSUMER DURABLES": 460,
      "HOME FURNISHING": 172,
      "PROPERTY": 283,
      "CONSTRUCTIONS": 289,
      "AGRICULTURE": 56,
      "ACCESSORIES": 49,
      "ANIMAL HUSBANDRY": 91,
      "TEXTILES&APPARELS": 26
    }
  }
]

const MirchiSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "FMCG": 15626,
      "EDUCATION": 12449,
      "HEALTHCARE": 10339,
      "AUTOMOBILE": 10273,
      "PUBLIC INTEREST": 6787,
      "CONSUMER DURABLES": 6318,
      "FINANCE": 5669,
      "PERSONAL CARE": 3390,
      "TELECOMMUNICATION": 3071,
      "ACCESSORIES": 1870,
      "ANIMAL HUSBANDRY": 1793,
      "CONSTRUCTIONS": 1527,
      "HOME FURNISHING": 1439,
      "PROPERTY": 1170,
      "ENTERTAINMENT": 678,
      "AGRICULTURE": 660,
      "RENEWABLE ENERGY": 420
    },
    "plays": {
      "FMCG": 980,
      "EDUCATION": 682,
      "HEALTHCARE": 519,
      "AUTOMOBILE": 471,
      "PUBLIC INTEREST": 187,
      "CONSUMER DURABLES": 368,
      "FINANCE": 256,
      "PERSONAL CARE": 102,
      "TELECOMMUNICATION": 134,
      "ACCESSORIES": 88,
      "ANIMAL HUSBANDRY": 104,
      "CONSTRUCTIONS": 74,
      "HOME FURNISHING": 92,
      "PROPERTY": 39,
      "ENTERTAINMENT": 48,
      "AGRICULTURE": 33,
      "RENEWABLE ENERGY": 42
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "EDUCATION": 20209,
      "FMCG": 17001,
      "AUTOMOBILE": 11288,
      "HEALTHCARE": 11281,
      "PUBLIC INTEREST": 9525,
      "PERSONAL CARE": 7718,
      "FINANCE": 7029,
      "TELECOMMUNICATION": 6300,
      "CONSUMER DURABLES": 5820,
      "ENTERTAINMENT": 2617,
      "CONSTRUCTIONS": 2241,
      "ACCESSORIES": 2003,
      "HOME FURNISHING": 1407,
      "ANIMAL HUSBANDRY": 1137,
      "PROPERTY": 960,
      "RENEWABLE ENERGY": 520,
      "E-COMMERCE": 225,
      "TEXTILES&APPARELS": 225,
      "AGRICULTURE": 164
    },
    "plays": {
      "EDUCATION": 955,
      "FMCG": 1029,
      "AUTOMOBILE": 502,
      "HEALTHCARE": 551,
      "PUBLIC INTEREST": 259,
      "PERSONAL CARE": 258,
      "FINANCE": 323,
      "TELECOMMUNICATION": 435,
      "CONSUMER DURABLES": 244,
      "ENTERTAINMENT": 163,
      "CONSTRUCTIONS": 106,
      "ACCESSORIES": 91,
      "HOME FURNISHING": 92,
      "ANIMAL HUSBANDRY": 94,
      "PROPERTY": 32,
      "RENEWABLE ENERGY": 52,
      "E-COMMERCE": 9,
      "TEXTILES&APPARELS": 15,
      "AGRICULTURE": 8
    }
  }
]

const RadioSectorAnalysis = () => {
  const [selectedWeeks, setSelectedWeeks] = useState(["week_1"]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [dataType, setDataType] = useState("seconds");
  const [highlightedSector, setHighlightedSector] = useState(null);

const sectors = {
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

  const weeks = [
    { value: "week_1", label: "Week 19 (May 07-13, 2025)", shortLabel: "Week 19" },
    { value: "week_2", label: "Week 20 (May 14-20, 2025)", shortLabel: "Week 20" },
  ];

  const stations = [
    { value: "all", label: "All Stations" },
    { value: "bigfm", label: "Big FM" },
    { value: "radiomirchi", label: "Radio Mirchi" },
    { value: "redfm", label: "Red FM" },
    { value: "radiocity", label: "Radio City" },
  ];

  const rawData = {
    BigFM: {
      region: "Patna",
      language: "hindi",
      weekly: Object.fromEntries(
        BigSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    RadioMirchi: {
      region: "Patna",
      language: "hindi",
      weekly: Object.fromEntries(
        MirchiSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    RedFM: {
      region: "Patna",
      language: "hindi",
      weekly: Object.fromEntries(
        RedSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    RadioCity: {
      region: "Patna",
      language: "hindi",
      weekly: Object.fromEntries(
        RadioCitySectorData.map(({ week, seconds, plays }) => [
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
                    className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
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
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 shadow-sm transition-all duration-200 ${
                highlightedSector === key
                  ? "bg-accent ring-2 ring-primary"
                  : "bg-popover hover:bg-muted"
              }`}
            >
              <div
                className="h-2.5 w-2.5 rounded-full ring-1 ring-border"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {sector.name}
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {filteredData.map((station) => (
            <div
              key={station.station}
              className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
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
                            <div className="text-xs font-medium text-foreground mb-2">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              No data available
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={weekData.week} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-xs font-medium text-foreground">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-xs font-semibold text-foreground">
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
                                .sort(([, a], [, b]) => b - a) // Sort in descending order
                                .map(([sectorKey, value]) => {
                                  const barWidth = (value / totalWeekValue) * 100;
                                  const percentage = ((value / totalWeekValue) * 100).toFixed(1);
                                  const isHighlighted =
                                    highlightedSector === null || highlightedSector === sectorKey;
                                  return (
                                    <div
                                      key={sectorKey}
                                      className="h-full flex items-center justify-center group transition-all duration-200 relative hover:scale-105"
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
                                      <div className="text-xs font-semibold text-white px-1.5 truncate drop-shadow">
                                        {formatValue(value)}
                                      </div>
                                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2.5 py-1 bg-background text-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
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