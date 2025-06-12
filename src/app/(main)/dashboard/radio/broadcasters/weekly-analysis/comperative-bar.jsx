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

const MangoSectorData = [
  {
    week: "week_1",
    seconds: {
      Entertainment: 12434,
      "Public Interest": 9493,
      Accessories: 9410,
      Automobile: 7136,
      "Consumer Durables": 4515,
      Property: 3768,
      Manufacturing: 1930,
      Education: 1852,
      Constructions: 1260,
      "Petroleum Products": 1072,
      "Internet Services": 1026,
      Retail: 810,
      FMCG: 475,
      Finance: 216,
    },
    plays: {
      Entertainment: 454,
      Accessories: 453,
      "Consumer Durables": 363,
      Automobile: 351,
      "Public Interest": 286,
      Manufacturing: 193,
      Constructions: 126,
      Property: 84,
      "Petroleum Products": 72,
      Education: 69,
      Retail: 54,
      "Internet Services": 52,
      FMCG: 25,
      Finance: 9,
    },
  },
  {
    week: "week_2",
    seconds: {
      Accessories: 12317,
      Entertainment: 6125,
      "Public Interest": 3185,
      Automobile: 3166,
      Education: 2971,
      Manufacturing: 2555,
      "Consumer Durables": 2324,
      "Petroleum Products": 1601,
      Constructions: 1240,
      Finance: 1134,
      Medicine: 660,
      FMCG: 568,
      Retail: 285,
    },
    plays: {
      Accessories: 614,
      Entertainment: 266,
      Manufacturing: 207,
      "Consumer Durables": 196,
      Automobile: 170,
      Education: 127,
      Constructions: 115,
      "Petroleum Products": 104,
      "Public Interest": 81,
      Medicine: 58,
      Finance: 47,
      FMCG: 31,
      Retail: 25,
    },
  },
];

const RedSectorData = [
  {
    week: "week_1",
    seconds: {
      "Consumer Durables": 14862,
      Entertainment: 14499,
      "Public Interest": 13608,
      Accessories: 11385,
      Automobile: 9549,
      "Home Furnishing": 5708,
      Finance: 3476,
      Medicine: 3155,
      FMCG: 2914,
      Manufacturing: 2840,
      Education: 2000,
      Retail: 1395,
      Constructions: 1214,
      "Petroleum Products": 1080,
      Property: 540,
      "Building Materials": 180,
    },
    plays: {
      Accessories: 1218,
      "Consumer Durables": 998,
      Entertainment: 636,
      FMCG: 547,
      Automobile: 519,
      Manufacturing: 490,
      "Home Furnishing": 475,
      "Public Interest": 393,
      Medicine: 369,
      Finance: 328,
      Constructions: 175,
      Retail: 93,
      "Petroleum Products": 72,
      Education: 60,
      "Building Materials": 18,
      Property: 18,
    },
  },
  {
    week: "week_2",
    seconds: {
      Accessories: 12611,
      Entertainment: 10752,
      "Consumer Durables": 9505,
      "Public Interest": 6630,
      Automobile: 6450,
      Finance: 3924,
      Manufacturing: 3691,
      FMCG: 3590,
      Medicine: 3432,
      "Home Furnishing": 2793,
      Constructions: 1836,
      Property: 1200,
      "Petroleum Products": 1035,
      Education: 880,
      "Travel & Tourism": 18,
    },
    plays: {
      Accessories: 1305,
      "Consumer Durables": 664,
      FMCG: 521,
      Manufacturing: 508,
      Entertainment: 480,
      Medicine: 359,
      Automobile: 352,
      Finance: 340,
      "Home Furnishing": 278,
      Constructions: 214,
      "Public Interest": 201,
      "Petroleum Products": 69,
      Property: 40,
      Education: 26,
      "Travel & Tourism": 3,
    },
  },
];

const ClubSectorData = [
  {
    week: "week_1",
    seconds: {
      "Consumer Durables": 13695,
      "Public Interest": 11687,
      Entertainment: 9304,
      Accessories: 7635,
      Retail: 2970,
      Medicine: 2375,
      Education: 2184,
      Automobile: 1900,
      FMCG: 1740,
      Manufacturing: 1710,
      "Home Furnishing": 1520,
      "Internet Services": 1440,
    },
    plays: {
      "Consumer Durables": 792,
      Accessories: 447,
      "Public Interest": 323,
      Retail: 226,
      Entertainment: 214,
      Manufacturing: 171,
      FMCG: 120,
      Automobile: 95,
      Medicine: 95,
      "Home Furnishing": 76,
      Education: 61,
      "Internet Services": 48,
    },
  },
  {
    week: "week_2",
    seconds: {
      Entertainment: 10748,
      Accessories: 8162,
      "Consumer Durables": 4075,
      "Public Interest": 3561,
      Education: 2560,
      Manufacturing: 2450,
      Retail: 1920,
      Automobile: 1860,
      "Home Furnishing": 1300,
      "Internet Services": 1050,
      Medicine: 655,
      FMCG: 260,
    },
    plays: {
      Entertainment: 462,
      Accessories: 404,
      "Consumer Durables": 284,
      Manufacturing: 199,
      Retail: 152,
      Education: 107,
      Automobile: 93,
      "Public Interest": 93,
      "Home Furnishing": 65,
      Medicine: 65,
      "Internet Services": 35,
      FMCG: 13,
    },
  },
];

const MirchiSectorData = [
  {
    week: "week_1",
    seconds: {
      "Public Interest": 10060,
      "Consumer Durables": 6485,
      Accessories: 4995,
      Automobile: 2530,
      Finance: 1860,
      Medicine: 1680,
      Entertainment: 1577,
      Manufacturing: 1530,
      "Personal Care": 525,
      Property: 420,
      "Home Furnishing": 135,
      Technology: 60,
    },
    plays: {
      "Consumer Durables": 458,
      Accessories: 291,
      "Public Interest": 257,
      Finance: 236,
      Manufacturing: 153,
      Automobile: 117,
      Entertainment: 106,
      "Personal Care": 35,
      Medicine: 28,
      "Home Furnishing": 27,
      Property: 14,
      Technology: 4,
    },
  },
  {
    week: "week_2",
    seconds: {
      Accessories: 4495,
      "Public Interest": 3210,
      "Consumer Durables": 2170,
      Manufacturing: 1030,
      "Travel & Tourism": 900,
      Finance: 700,
      "Health Drink": 645,
      Entertainment: 560,
      "Personal Care": 345,
      "Household Products": 310,
      Automobile: 300,
      "Home Furnishing": 160,
      Medicine: 150,
      Airline: 60,
    },
    plays: {
      Accessories: 229,
      "Consumer Durables": 171,
      Finance: 140,
      "Public Interest": 107,
      Manufacturing: 103,
      Entertainment: 51,
      "Health Drink": 43,
      "Household Products": 34,
      "Home Furnishing": 32,
      "Personal Care": 23,
      "Travel & Tourism": 12,
      Automobile: 12,
      Medicine: 10,
      Airline: 2,
    },
  },
];

const RadioSectorAnalysis = () => {
  const [selectedWeeks, setSelectedWeeks] = useState(["week_1"]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [dataType, setDataType] = useState("seconds");

  // Define sectors with colors
const sectors = {
  Accessories: { name: "Accessories", color: "#34D399" },
  Airline: { name: "Airline", color: "#60A5FA" },
  Automobile: { name: "Automobile", color: "#F472B6" },
  "Building Materials": { name: "Building Materials", color: "#A78BFA" },
  Constructions: { name: "Constructions", color: "#F59E0B" },
  "Consumer Durables": { name: "Consumer Durables", color: "#3B82F6" },
  Education: { name: "Education", color: "#4ADE80" },
  Entertainment: { name: "Entertainment", color: "#F87171" },
  Finance: { name: "Finance", color: "#2DD4BF" },
  FMCG: { name: "FMCG", color: "#FB923C" },
  "Health Drink": { name: "Health Drink", color: "#D946EF" },
  "Home Furnishing": { name: "Home Furnishing", color: "#22D3EE" },
  "Household Products": { name: "Household Products", color: "#E879F9" },
  "Internet Services": { name: "Internet Services", color: "#FCA5A5" },
  Manufacturing: { name: "Manufacturing", color: "#818CF8" },
  Medicine: { name: "Medicine", color: "#5EEAD4" },
  "Personal Care": { name: "Personal Care", color: "#EAB308" },
  "Petroleum Products": { name: "Petroleum Products", color: "#EF4444" },
  Property: { name: "Property", color: "#38BDF8" },
  "Public Interest": { name: "Public Interest", color: "#F472B6" },
  Retail: { name: "Retail", color: "#34D399" },
  Technology: { name: "Technology", color: "#A78BFA" },
  "Travel & Tourism": { name: "Travel & Tourism", color: "#4ADE80" }
};

  // Define weeks
  const weeks = [
    { value: "week_1", label: "Week 16 (Apr 17-23, 2025)", shortLabel: "Week 16" },
    { value: "week_2", label: "Week 17 (Apr 24-30, 2025)", shortLabel: "Week 17" },
  ];

  // Define stations
  const stations = [
    { value: "all", label: "All Stations" },
    { value: "mangofm", label: "MangoFM" },
    { value: "redfm", label: "RedFM" },
    { value: "clubfm", label: "ClubFM" },
    { value: "radiomirchi", label: "RadioMirchi" },
  ];

  // Combine and normalize data
  const rawData = {
    MangoFM: {
      region: "Kochi",
      language: "malayalam",
      weekly: Object.fromEntries(
        MangoSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    RedFM: {
      region: "Kochi",
      language: "malayalam",
      weekly: Object.fromEntries(
        RedSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    ClubFM: {
      region: "Kochi",
      language: "malayalam",
      weekly: Object.fromEntries(
        ClubSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    RadioMirchi: {
      region: "Kochi",
      language: "malayalam",
      weekly: Object.fromEntries(
        MirchiSectorData.map(({ week, seconds, plays }) => [
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
                    <SelectValue placeholder={formatSelectedWeeks(selectedWeeks)} />
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
                      console.log(
                        `Station: ${station.station}, Week: ${weekData.week}, Total ${dataType}: ${totalWeekValue}`
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
                              style={{ width: "100%" }} // Set to 100% to fill the container
                            >
                              {Object.entries(weekData.sectors)
                                .filter(([, value]) => value > 0) // Only include sectors with non-zero values
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