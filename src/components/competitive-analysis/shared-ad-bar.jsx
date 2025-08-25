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
import { Separator } from "@/components/ui/separator";
import MultipleSelector from "@/components/ui/multiselect";

export const description =
  "A custom horizontal stacked bar chart showing the percentage distribution of shared ads across stations";

const SharedAdBar = ({ data }) => {
  const [selectedAds, setSelectedAds] = useState(() => {
    // Calculate top 5 ads by total adCount
    const adTotals = {};
    data.data.forEach((item) => {
      const totalCount = item.stations.reduce((sum, s) => sum + s.adCount, 0);
      adTotals[item.adName] = totalCount;
    });
    return Object.entries(adTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([adName]) => ({ value: adName, label: adName }));
  });
  const [activeStation, setActiveStation] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const chartContainerRef = useRef(null);

  // Derive unique stations and ad options
  const allStations = data.stations || [];
  const adOptions = Array.from(
    new Set(data.data.map((item) => item.adName))
  ).map((ad) => ({
    value: ad,
    label: ad,
  }));

  // Handle ad selection
  const handleAdChange = (ads) => {
    setSelectedAds(ads.length > 0 ? ads : adOptions.slice(0, 5));
  };

  // Prepare chart data
  const chartData = selectedAds.map((ad) => {
    const adData = {
      adName: ad.value,
      _rawValues: {},
      _totalValue: 0,
    };

    // Get data for the ad
    const itemData = data.data.find((item) => item.adName === ad.value);
    if (!itemData) return adData;

    // Aggregate data (only one week, but structure allows)
    const rawValues = {};
    let totalValue = 0;
    allStations.forEach((station) => {
      const stationEntry = itemData.stations.find((s) => s.station === station);
      const stationValue = stationEntry?.adCount || 0;
      rawValues[station] = stationValue;
      totalValue += stationValue;
    });

    // Avoid division by zero
    const total = totalValue || 1;
    allStations.forEach((station) => {
      adData[station] = (rawValues[station] / total) * 100;
    });
    adData._rawValues = rawValues;
    adData._totalValue = totalValue;
    return adData;
  });

  // Handle mouse events for tooltip
  const handleMouseEnter = (
    e,
    adName,
    station,
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
        adName,
        station,
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

  // Handle station click to toggle active station
  const handleStationClick = (station) => {
    setActiveStation(activeStation === station ? null : station);
  };

  // Calculate chart dimensions
  const barHeight = 40;
  const barGap = 20;
  const chartHeight = selectedAds.length * (barHeight + barGap) - barGap;
  const yAxisWidth = 80;

  // Colors for different stations
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff4d4f"];
  const stationColors = allStations.reduce((acc, station, index) => {
    acc[station] = colors[index % colors.length];
    return acc;
  }, {});

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Shared Ad Distribution</CardTitle>
          <CardDescription>
            Ad count distribution across stations
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <MultipleSelector
            value={selectedAds}
            onChange={handleAdChange}
            defaultOptions={adOptions}
            placeholder="Select ads"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No ads found</p>}
            className="max-w-64 w-full"
          />
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
            {selectedAds.map((ad, index) => (
              <div
                key={ad.value}
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
                {ad.value}
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
            {chartData.map((adData, index) => {
              let currentWidth = 0;
              const totalValue = adData._totalValue;
              // Sort stations by percentage in descending order
              const sortedStations = [...allStations].sort((a, b) => {
                const aPercentage = adData[a] || 0;
                const bPercentage = adData[b] || 0;
                return bPercentage - aPercentage;
              });
              return (
                <div
                  key={String(adData.adName)}
                  className="flex relative"
                  style={{
                    position: "absolute",
                    top: `${index * (barHeight + barGap)}px`,
                    height: `${barHeight}px`,
                    width: "100%",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sortedStations.map((station) => {
                    const percentage = adData[station] || 0;
                    const rawValue = adData._rawValues[station] || 0;
                    if (rawValue === 0) return null;
                    const segmentWidth = `${percentage}%`;
                    const isActive =
                      !activeStation || activeStation === station;
                    const segment = (
                      <div
                        key={station}
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{
                          width: segmentWidth,
                          height: "100%",
                          backgroundColor: stationColors[station],
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
                            adData.adName,
                            station,
                            rawValue,
                            percentage,
                            totalValue,
                            stationColors[station]
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
                          {rawValue} spot
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
                    {totalValue} spot
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
              <p className="font-semibold">{tooltip.adName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {tooltip.station}
                </span>
              </div>
              <p className="text-sm font-medium mt-1">{tooltip.value} spot</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(tooltip.percentage)}% of {tooltip.total} spot
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <div className="flex flex-wrap gap-2 mt-2">
          {allStations.map((station, index) => (
            <button
              key={station}
              onClick={() => handleStationClick(station)}
              className={`px-2 py-1 rounded-full text-xs font-medium text-white transition-opacity ${
                activeStation && activeStation !== station
                  ? "opacity-50"
                  : "opacity-100"
              }`}
              style={{ backgroundColor: stationColors[station] }}
            >
              {station}
            </button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SharedAdBar;
