"use client";

import React, { useEffect, useState } from "react";
import RegionSelect from "@/components/regionSelector";
import AdFrequencyHeatmap from "@/components/competitive-analysis/ad-frequency-heatmap";
import StatCards from "@/components/competitive-analysis/stat-cards";
import SectorAdDistributionBar from "@/components/competitive-analysis/sector-ad-distribution-bar";
import AdDailyTrendsLine from "@/components/competitive-analysis/ad-daily-trends-line";
import TopAdComparisonTable from "@/components/competitive-analysis/top-ad-comparison-table";
import UntappedAdTable from "@/components/competitive-analysis/untapped-ad-table";
import NewAdTable from "@/components/competitive-analysis/new-ad-table";
import SharedAdBar from "@/components/competitive-analysis/shared-ad-bar";
import MarketShareTreemap from "@/components/competitive-analysis/market-share-treemap";

export default function CompetitiveAnalysisPage() {
  const [region, setRegion] = useState("delhi");
  const [errorMessage, setErrorMessage] = useState(null);

  const [statCardsData, setStatCardsData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [dailyTrendsData, setDailyTrendsData] = useState(null);
  const [topAdData, setTopAdData] = useState(null);
  const [untappedAdData, setUntappedAdData] = useState(null);
  const [newAdData, setNewAdData] = useState(null);
  const [sharedAdData, setSharedAdData] = useState(null);
  const [marketShareData, setMarketShareData] = useState(null);
  const [marketShareSecondsData, setMarketShareSecondsData] = useState(null);

  const base = `${process.env.NEXT_PUBLIC_BASE_URL}/data/${region}/competitive-analysis`;

  useEffect(() => {
    async function fetchAll() {
      setErrorMessage(null);
      try {
        const fetchJson = async (path) => {
          const res = await fetch(`${base}/${path}`);
          if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
          return res.json();
        };

        const [
          statCards,
          heatmap,
          sector,
          trends,
          topAd,
          untapped,
          newAd,
          sharedAd,
          marketShare,
          marketShareSeconds,
        ] = await Promise.all([
          fetchJson("stat-cards.json"),
          fetchJson("ad-frequency-heatmap.json"),
          fetchJson("sector-ad-distribution.json"),
          fetchJson("ad-daily-trends.json"),
          fetchJson("top-ad-comparison.json"),
          fetchJson("untapped-ad-table.json"),
          fetchJson("new-ad.json"),
          fetchJson("shared-ad.json"),
          fetchJson("market-share.json"),
          fetchJson("market-share-seconds.json"),
        ]);

        setStatCardsData(statCards?.weeks ?? []);
        setHeatmapData(heatmap);
        setSectorData(sector);
        setDailyTrendsData(trends);
        setTopAdData(topAd);
        setUntappedAdData(untapped);
        setNewAdData(newAd);
        setSharedAdData(sharedAd);
        setMarketShareData(marketShare);
        setMarketShareSecondsData(marketShareSeconds);
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message);
      }
    }

    fetchAll();
  }, [region]);

  return (
    <div className="space-y-8 p-4">
      <RegionSelect region={region} setRegion={setRegion} />

      {errorMessage && (
        <div className="text-red-500">
          <h2>Error Loading Data</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {statCardsData && <StatCards data={statCardsData} />}
      {heatmapData && <AdFrequencyHeatmap data={heatmapData} />}
      {sectorData && <SectorAdDistributionBar data={sectorData} />}
      {marketShareData && marketShareSecondsData && (
        <MarketShareTreemap data={marketShareData} secondsData={marketShareSecondsData} />
      )}
      {dailyTrendsData && <AdDailyTrendsLine data={dailyTrendsData} />}
      {sharedAdData && <SharedAdBar data={sharedAdData} />}
      {topAdData && <TopAdComparisonTable data={topAdData} />}
      {untappedAdData && <UntappedAdTable data={untappedAdData} />}
      {newAdData && <NewAdTable data={newAdData} />}
    </div>
  );
}
