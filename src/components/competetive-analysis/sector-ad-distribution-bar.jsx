/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import MultipleSelector from "@/components/ui/multiselect";

export const description =
  "A custom horizontal stacked bar chart for sector ad distribution by station with multi-week and station selection";

const SectorAdDistributionBar = ({ data }) => {
  const [selectedWeeks, setSelectedWeeks] = useState([
    { value: data.weeks[0]?.week || "", label: data.weeks[0]?.week || "" },
  ]);
  const [selectedStations, setSelectedStations] = useState([
    { value: "all", label: "All Stations" },
  ]);
  const [showAirtime, setShowAirtime] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [activeSector, setActiveSector] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const chartContainerRef = useRef(null);

  // Derive unique stations from the first week's data
  const allStations = data.weeks[0]?.data[0]?.stations.map((s) => s.station) || [];
  const weekOptions = data.weeks.map((week) => ({
    value: week.week,
    label: week.week,
  }));
  const stationOptions = [
    { value: "all", label: "All Stations" },
    ...allStations.map((station) => ({ value: station, label: station })),
  ];

  // Handle week selection
  const handleWeekChange = (weeks) => {
    // Ensure at least one week is selected
    setSelectedWeeks(weeks.length > 0 ? weeks : [{ value: data.weeks[0].week, label: data.weeks[0].week }]);
  };

  // Handle station selection
  const handleStationChange = (stations) => {
    // Ensure at least one station or "all" is selected
    setSelectedStations(stations.length > 0 ? stations : [{ value: "all", label: "All Stations" }]);
  };

  // Prepare chart data
  const stations = selectedStations.some((s) => s.value === "all")
    ? allStations
    : selectedStations.map((s) => s.value);
  const chartData = stations.map((station) => {
    const stationData = {
      station,
      _rawValues: {},
    };

    // Aggregate data across selected weeks
    const rawValues = {};
    data.sectors.forEach((sector) => {
      let totalValue = 0;
      selectedWeeks.forEach((week) => {
        const weekData = data.weeks.find((w) => w.week === week.value);
        const stationEntry = weekData?.data
          .find((s) => s.sector === sector.name)
          ?.stations.find((s) => s.station === station);
        totalValue += showAirtime ? stationEntry?.airtime || 0 : stationEntry?.adCount || 0;
      });
      rawValues[sector.name] = totalValue;
    });

    // Avoid division by zero
    const total = Object.values(rawValues).reduce((sum, val) => sum + val, 0) || 1;
    data.sectors.forEach((sector) => {
      stationData[sector.name] = (rawValues[sector.name] / total) * 100;
    });
    stationData._rawValues = rawValues;
    return stationData;
  });

  // Handle mouse events for tooltip
  const handleMouseEnter = (e, station, sector, value, percentage, color) => {
    const rect = chartContainerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left + 10,
        y: e.clientY - rect.top - 50,
        station,
        sector,
        value,
        percentage,
        color,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Handle sector click to toggle active sector
  const handleSectorClick = (sector) => {
    setActiveSector(activeSector === sector ? null : sector);
  };

  // Calculate chart dimensions
  const barHeight = 40;
  const barGap = 10;
  const chartHeight = stations.length * (barHeight + barGap) - barGap;
  const yAxisWidth = 80;

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Sector Ad Distribution by Station</CardTitle>
          <CardDescription>
            {showAirtime ? "Ad airtime (seconds)" : "Ad counts"} for{" "}
            {selectedWeeks.map((w) => w.label).join(", ")}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <MultipleSelector
            value={selectedWeeks}
            onChange={handleWeekChange}
            defaultOptions={weekOptions}
            placeholder="Select weeks"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No weeks found</p>}
            className="max-w-64 w-full"
          />
          <MultipleSelector
            value={selectedStations}
            onChange={handleStationChange}
            defaultOptions={stationOptions}
            placeholder="Select stations"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No stations found</p>}
            className="max-w-64 w-full"
          />
          <Toggle
            pressed={showAirtime}
            onPressedChange={setShowAirtime}
            className="w-full"
          >
            {showAirtime ? "Show Ad Counts" : "Show Airtime (s)"}
        </Toggle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <div
          ref={chartContainerRef}
          className="relative w-full"
          style={{ height: `${chartHeight + 20}px` }}
        >
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0" style={{ width: `${yAxisWidth}px` }}>
            {stations.map((station, index) => (
              <div
                key={station}
                className="text-xs"
                style={{
                  position: "absolute",
                  top: `${index * (barHeight + barGap) + barHeight / 2}px`,
                  transform: "translateY(-50%)",
                  textAlign: "right",
                  paddingRight: "8px",
                  width: `${yAxisWidth}px`,
                }}
              >
                {station}
              </div>
            ))}
          </div>
          {/* Bars */}
          <div
            className="relative"
            style={{ marginLeft: `${yAxisWidth}px`, height: `${chartHeight}px` }}
          >
            {chartData.map((stationData, index) => {
              let currentWidth = 0;
              // Sort sectors by percentage in descending order
              const sortedSectors = [...data.sectors].sort((a, b) => {
                const aPercentage = stationData[a.name] || 0;
                const bPercentage = stationData[b.name] || 0;
                return bPercentage - aPercentage; // Descending order
              });
              return (
                <div
                  key={String(stationData.station)}
                  className="flex"
                  style={{
                    position: "absolute",
                    top: `${index * (barHeight + barGap)}px`,
                    height: `${barHeight}px`,
                    width: "100%",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sortedSectors.map((sector) => {
                    const percentage = stationData[sector.name] || 0;
                    const rawValue = stationData._rawValues[sector.name] || 0;
                    if (rawValue === 0) return null;
                    const segmentWidth = `${percentage}%`;
                    const isActive = !activeSector || activeSector === sector.name;
                    const segment = (
                      <div
                        key={sector.name}
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{
                          width: segmentWidth,
                          height: "100%",
                          backgroundColor: sector.color,
                          opacity: isActive ? 1 : 0.3,
                          borderRadius:
                            currentWidth === 0
                              ? "6px 0 0 6px"
                              : currentWidth + percentage >= 99.5
                              ? "0 6px 6px 0"
                              : "0",
                          transition: "width 0.3s ease, opacity 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          handleMouseEnter(
                            e,
                            stationData.station,
                            sector.name,
                            rawValue,
                            percentage,
                            sector.color
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <span
                          className="text-white text-xs font-medium"
                          style={{
                            whiteSpace: "nowrap",
                            textShadow: "0 0 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {rawValue} {showAirtime ? "sec" : "count"}
                        </span>
                      </div>
                    );
                    currentWidth += percentage;
                    return segment;
                  })}
                </div>
              );
            })}
          </div>
          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute bg-card p-3 border rounded-lg shadow-lg pointer-events-none"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transition: "opacity 0.2s ease",
                opacity: tooltip.visible ? 1 : 0,
              }}
            >
              <p className="font-semibold">{tooltip.station}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className="text-sm text-muted-foreground">{tooltip.sector}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {tooltip.value} {showAirtime ? "sec" : "count"}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round(tooltip.percentage)}% of total
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <Collapsible
          open={isCollapsibleOpen}
          onOpenChange={setIsCollapsibleOpen}
          className="w-full"
        >
          <CollapsibleTrigger className="flex items-center justify-between gap-2 text-sm font-medium w-full bg-secondary p-2 rounded hover:bg-secondary/80 transition-colors cursor-pointer">
            {isCollapsibleOpen ? "Hide Labels" : "Show Labels"}
            {isCollapsibleOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-wrap gap-2 mt-2">
            {data.sectors.map((sector) => (
              <button
                key={sector.name}
                onClick={() => handleSectorClick(sector.name)}
                className={`px-2 py-1 rounded-full text-xs font-medium text-white transition-opacity ${
                  activeSector && activeSector !== sector.name
                    ? "opacity-50"
                    : "opacity-100"
                }`}
                style={{ backgroundColor: sector.color }}
              >
                {sector.name}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default SectorAdDistributionBar;