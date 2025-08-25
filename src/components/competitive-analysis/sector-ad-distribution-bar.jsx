/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import MultipleSelector from "@/components/ui/multiselect";

export const description =
  "A custom horizontal stacked bar chart for sector ad distribution by station with station selection";

const SectorAdDistributionBar = ({ data }) => {
  const [selectedStations, setSelectedStations] = useState([
    { value: "all", label: "All Stations" },
  ]);
  const [showAirtime, setShowAirtime] = useState(false);
  const [activeSector, setActiveSector] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const chartContainerRef = useRef(null);

  // Derive unique stations from data
  const allStations = [
    ...new Set(
      data.data.flatMap((sector) => sector.stations.map((s) => s.station))
    ),
  ].sort();
  const stationOptions = [
    { value: "all", label: "All Stations" },
    ...allStations.map((station) => ({ value: station, label: station })),
  ];

  // Handle station selection
  const handleStationChange = (stations) => {
    setSelectedStations(
      stations.length > 0 ? stations : [{ value: "all", label: "All Stations" }]
    );
  };

  // Prepare chart data
  const stations = selectedStations.some((s) => s.value === "all")
    ? allStations
    : selectedStations.map((s) => s.value);
  const chartData = stations.map((station) => {
    const stationData = {
      station,
      _rawValues: {},
      _totalValue: 0,
    };

    // Aggregate data for the station across all sectors
    const rawValues = {};
    let totalValue = 0;
    data.sectors.forEach((sector) => {
      const sectorData = data.data.find((d) => d.sector === sector.name);
      const stationEntry = sectorData?.stations.find(
        (s) => s.station === station
      );
      const sectorValue = showAirtime
        ? stationEntry?.airtime || 0
        : stationEntry?.adCount || 0;
      rawValues[sector.name] = sectorValue;
      totalValue += sectorValue;
    });

    // Avoid division by zero
    const total = totalValue || 1;
    data.sectors.forEach((sector) => {
      stationData[sector.name] = (rawValues[sector.name] / total) * 100;
    });
    stationData._rawValues = rawValues;
    stationData._totalValue = totalValue;
    return stationData;
  });

  // Handle mouse events for tooltip
  const handleMouseEnter = (
    e,
    station,
    sector,
    value,
    percentage,
    total,
    color
  ) => {
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
        total,
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
  const barHeight = 60;
  const barGap = 40;
  const chartHeight = stations.length * (barHeight + barGap) - barGap;
  const yAxisWidth = 80;

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Sector Ad Distribution by Station</CardTitle>
          <CardDescription>
            {showAirtime ? "Ad airtime (seconds)" : "Ad spots"} across selected
            stations
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <MultipleSelector
            value={selectedStations}
            onChange={handleStationChange}
            defaultOptions={stationOptions}
            placeholder="Select stations"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No stations found</p>
            }
            className="max-w-64 w-full"
          />
          <Toggle
            pressed={showAirtime}
            onPressedChange={setShowAirtime}
            className="w-full"
          >
            {showAirtime ? "Show Ad spots" : "Show Airtime (s)"}
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
          <div
            className="absolute left-0 top-0"
            style={{ width: `${yAxisWidth}px` }}
          >
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
            style={{
              marginLeft: `${yAxisWidth}px`,
              height: `${chartHeight}px`,
            }}
          >
            {chartData.map((stationData, index) => {
              let currentWidth = 0;
              const totalValue = stationData._totalValue;
              // Sort sectors by percentage in descending order
              const sortedSectors = [...data.sectors].sort((a, b) => {
                const aPercentage = stationData[a.name] || 0;
                const bPercentage = stationData[b.name] || 0;
                return bPercentage - aPercentage;
              });
              return (
                <div
                  key={String(stationData.station)}
                  className="flex relative"
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
                    const isActive =
                      !activeSector || activeSector === sector.name;
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
                            totalValue,
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
                          {rawValue} {showAirtime ? "sec" : "spot"}
                        </span>
                      </div>
                    );
                    currentWidth += percentage;
                    return segment;
                  })}
                  {/* Total Value Label */}
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      position: "absolute",
                      top: "-24px",
                      right: "0",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {totalValue} {showAirtime ? "sec" : "spot"}
                  </span>
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
                <span className="text-sm text-muted-foreground">
                  {tooltip.sector}
                </span>
              </div>
              <p className="text-sm font-medium mt-1">
                {tooltip.value} {showAirtime ? "sec" : "spot"}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round(tooltip.percentage)}% of {tooltip.total}{" "}
                {showAirtime ? "sec" : "spot"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <div className="flex flex-wrap gap-2 mt-2">
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default SectorAdDistributionBar;
