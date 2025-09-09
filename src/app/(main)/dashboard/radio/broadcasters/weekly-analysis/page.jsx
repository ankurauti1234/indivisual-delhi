"use client";

import { useState, useEffect } from "react";

import AdFrequencyHeatmap from "@/components/competitive-analysis/ad-frequency-heatmap";
import StatCards from "@/components/competitive-analysis/stat-cards";
import SectorAdDistributionBar from "@/components/competitive-analysis/sector-ad-distribution-bar";
import AdDailyTrendsLine from "@/components/competitive-analysis/ad-daily-trends-line";
import TopAdComparisonTable from "@/components/competitive-analysis/top-ad-comparison-table";
import UntappedAdTable from "@/components/competitive-analysis/untapped-ad-table";
import NewAdTable from "@/components/competitive-analysis/new-ad-table";
import SharedAdBar from "@/components/competitive-analysis/shared-ad-bar";
import MarketShareTreemap from "@/components/competitive-analysis/market-share-treemap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WeeklyAnalysisPage() {
  const [cities, setCities] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 new state

  // Fetch cities on load
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const cities = await res.json();
        setCities(cities);
        if (cities.length > 0) {
          setSelectedCity(cities[0]);
        }
      } catch (err) {
        setError("Failed to load cities");
      }
    };
    fetchCities();
  }, []);

  // Fetch weeks when city changes
  useEffect(() => {
    if (!selectedCity) return;
    const fetchWeeks = async () => {
      try {
        const res = await fetch(`/api/weeks?city=${selectedCity}`);
        const weeks = await res.json();
        setWeeks(weeks);
        if (weeks.length > 0) {
          setSelectedWeek(weeks[0]);
        }
      } catch (err) {
        setError("Failed to load weeks");
      }
    };
    fetchWeeks();
  }, [selectedCity]);

  // Fetch dashboard JSONs when city/week changes
  useEffect(() => {
    if (!selectedCity || !selectedWeek) return;

    const files = [
      "stat-cards.json",
      "ad-frequency-heatmap.json",
      "sector-ad-distribution.json",
      "ad-daily-trends.json",
      "top-ad-comparison.json",
      "untapped-ad-table.json",
      "new-ad.json",
      "shared-ad.json",
      "market-share.json",
      "market-share-seconds.json",
    ];

    const fetchAll = async () => {
      setLoading(true); // 👈 start loading
      try {
        const results = {};
        await Promise.all(
          files.map(async (file) => {
            const res = await fetch(
              `/api/file?city=${selectedCity}&week=${selectedWeek}&file=${file}`,
              { cache: "no-store" }
            );
            if (!res.ok) throw new Error(`${file} failed`);
            results[file] = await res.json();
          })
        );
        setData(results);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false); // 👈 stop loading
      }
    };

    fetchAll();
  }, [selectedCity, selectedWeek]);

  return (
    <div className="space-y-8 p-4">
      {/* Error Message */}
      {error && (
        <div className="text-red-500">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800 dark:border-zinc-100"></div>
          <span className="ml-3 text-zinc-600 dark:text-zinc-300">
            Loading dashboard...
          </span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Filters Row */}
          <div className="flex justify-between items-center gap-8">
            {/* City Selector */}
            <div className="flex items-center gap-4">
              <label className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                City:
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[200px] border p-1">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Week Selector */}
            <div className="flex items-center gap-4">
              <label className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                Week:
              </label>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-[200px] border p-1">
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                  {weeks.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dashboard Components */}
          {data["stat-cards.json"] && (
            <StatCards data={data["stat-cards.json"].cards} />
          )}
          {data["ad-frequency-heatmap.json"] && (
            <AdFrequencyHeatmap data={data["ad-frequency-heatmap.json"]} />
          )}
          {data["sector-ad-distribution.json"] && (
            <SectorAdDistributionBar
              data={data["sector-ad-distribution.json"]}
            />
          )}
          {data["market-share.json"] && data["market-share-seconds.json"] && (
            <MarketShareTreemap
              data={data["market-share.json"]}
              secondsData={data["market-share-seconds.json"]}
            />
          )}
          {data["ad-daily-trends.json"] && (
            <AdDailyTrendsLine data={data["ad-daily-trends.json"]} />
          )}
          {data["shared-ad.json"] && (
            <SharedAdBar
              data={data["shared-ad.json"]}
              city={selectedCity}
              week={selectedWeek}
            />
          )}
          {data["top-ad-comparison.json"] && (
            <TopAdComparisonTable data={data["top-ad-comparison.json"]} />
          )}
          {data["untapped-ad-table.json"] && (
            <UntappedAdTable data={data["untapped-ad-table.json"]} />
          )}
          {data["new-ad.json"] && <NewAdTable data={data["new-ad.json"]} />}
        </>
      )}
    </div>
  );
}
