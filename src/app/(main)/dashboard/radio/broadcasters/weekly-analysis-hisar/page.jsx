import AdFrequencyHeatmap from "@/components/competitive-analysis/ad-frequency-heatmap";
import StatCards from "@/components/competitive-analysis/stat-cards";
import SectorAdDistributionBar from "@/components/competitive-analysis/sector-ad-distribution-bar";
import AdDailyTrendsLine from "@/components/competitive-analysis/ad-daily-trends-line";
import TopAdComparisonTable from "@/components/competitive-analysis/top-ad-comparison-table";
import UntappedAdTable from "@/components/competitive-analysis/untapped-ad-table";
import NewAdTable from "@/components/competitive-analysis/new-ad-table";
import SharedAdBar from "@/components/competitive-analysis/shared-ad-bar";
import MarketShareTreemap from "@/components/competitive-analysis/market-share-treemap";
import React from "react";

export default async function Page() {
  let statCardsData = null;
  let heatmapData = null;
  let sectorData = null;
  let dailyTrendsData = null;
  let topAdData = null;
  let untappedAdData = null;
  let newAdData = null;
  let sharedAdData = null;
  let marketShareData = null;
  let marketShareSecondsData = null;
  let errorMessage = null;

  // Fetch stat-cards data
  try {
    const statCardsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/stat-cards.json`,
      {
        cache: "no-store",
      }
    );
    if (!statCardsRes.ok) {
      throw new Error(
        `Failed to fetch stat-cards.json: ${statCardsRes.status} ${statCardsRes.statusText}`
      );
    }
    statCardsData = await statCardsRes.json();
  } catch (error) {
    console.error("Error fetching stat-cards.json:", error);
    errorMessage =
      error instanceof Error ? error.message : "Failed to load stat cards data";
  }

  // Fetch ad-frequency-heatmap data
  try {
    const heatmapRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/ad-frequency-heatmap.json`,
      {
        cache: "no-store",
      }
    );
    if (!heatmapRes.ok) {
      throw new Error(
        `Failed to fetch ad-frequency-heatmap.json: ${heatmapRes.status} ${heatmapRes.statusText}`
      );
    }
    heatmapData = await heatmapRes.json();
  } catch (error) {
    console.error("Error fetching ad-frequency-heatmap.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error ? error.message : "Failed to load heatmap data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load heatmap data";
  }

  // Fetch sector-ad-distribution data
  try {
    const sectorRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/sector-ad-distribution.json`,
      {
        cache: "no-store",
      }
    );
    if (!sectorRes.ok) {
      throw new Error(
        `Failed to fetch sector-ad-distribution.json: ${sectorRes.status} ${sectorRes.statusText}`
      );
    }
    sectorData = await sectorRes.json();
  } catch (error) {
    console.error("Error fetching sector-ad-distribution.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error ? error.message : "Failed to load sector data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load sector data";
  }

  // Fetch ad-daily-trends data
  try {
    const dailyTrendsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/ad-daily-trends.json`,
      {
        cache: "no-store",
      }
    );
    if (!dailyTrendsRes.ok) {
      throw new Error(
        `Failed to fetch ad-daily-trends.json: ${dailyTrendsRes.status} ${dailyTrendsRes.statusText}`
      );
    }
    dailyTrendsData = await dailyTrendsRes.json();
  } catch (error) {
    console.error("Error fetching ad-daily-trends.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load daily trends data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load daily trends data";
  }

  // Fetch top-ad-comparison data
  try {
    const topAdRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/top-ad-comparison.json`,
      {
        cache: "no-store",
      }
    );
    if (!topAdRes.ok) {
      throw new Error(
        `Failed to fetch top-ad-comparison.json: ${topAdRes.status} ${topAdRes.statusText}`
      );
    }
    topAdData = await topAdRes.json();
  } catch (error) {
    console.error("Error fetching top-ad-comparison.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load top ad comparison data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load top ad comparison data";
  }

  // Fetch untapped-ad-table data
  try {
    const untappedAdRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/untapped-ad-table.json`,
      {
        cache: "no-store",
      }
    );
    if (!untappedAdRes.ok) {
      throw new Error(
        `Failed to fetch untapped-ad-table.json: ${untappedAdRes.status} ${untappedAdRes.statusText}`
      );
    }
    untappedAdData = await untappedAdRes.json();
  } catch (error) {
    console.error("Error fetching untapped-ad-table.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load untapped ad data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load untapped ad data";
  }

  // Fetch new-ad-table data
  try {
    const newAdRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/new-ad.json`,
      {
        cache: "no-store",
      }
    );
    if (!newAdRes.ok) {
      throw new Error(
        `Failed to fetch new-ad.json: ${newAdRes.status} ${newAdRes.statusText}`
      );
    }
    newAdData = await newAdRes.json();
  } catch (error) {
    console.error("Error fetching new-ad.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error ? error.message : "Failed to load new ad data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load new ad data";
  }

  // Fetch shared-ad-bar data
  try {
    const sharedAdRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/shared-ad.json`,
      {
        cache: "no-store",
      }
    );
    if (!sharedAdRes.ok) {
      throw new Error(
        `Failed to fetch shared-ad.json: ${sharedAdRes.status} ${sharedAdRes.statusText}`
      );
    }
    sharedAdData = await sharedAdRes.json();
  } catch (error) {
    console.error("Error fetching shared-ad.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load shared ad data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load shared ad data";
  }

  // Fetch market-share-treemap data (counts)
  try {
    const marketShareRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/market-share.json`,
      {
        cache: "no-store",
      }
    );
    if (!marketShareRes.ok) {
      throw new Error(
        `Failed to fetch market-share.json: ${marketShareRes.status} ${marketShareRes.statusText}`
      );
    }
    marketShareData = await marketShareRes.json();
  } catch (error) {
    console.error("Error fetching market-share.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load market share data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load market share data";
  }

  // Fetch market-share-seconds-treemap data (seconds)
  try {
    const marketShareSecondsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/hisar/competitive-analysis/market-share-seconds.json`,
      {
        cache: "no-store",
      }
    );
    if (!marketShareSecondsRes.ok) {
      throw new Error(
        `Failed to fetch market-share-seconds.json: ${marketShareSecondsRes.status} ${marketShareSecondsRes.statusText}`
      );
    }
    marketShareSecondsData = await marketShareSecondsRes.json();
  } catch (error) {
    console.error("Error fetching market-share-seconds.json:", error);
    errorMessage = errorMessage
      ? `${errorMessage}; ${
          error instanceof Error
            ? error.message
            : "Failed to load market share seconds data"
        }`
      : error instanceof Error
      ? error.message
      : "Failed to load market share seconds data";
  }

  // Render components conditionally
  return (
    <div className="space-y-8 p-4">
      {errorMessage && (
        <div className="text-red-500">
          <h2>Error Loading Data</h2>
          <p>{errorMessage}</p>
        </div>
      )}
      {statCardsData && <StatCards data={statCardsData.weeks} />}
      {heatmapData && <AdFrequencyHeatmap data={heatmapData} />}
      {sectorData && <SectorAdDistributionBar data={sectorData} />}
      {marketShareData && marketShareSecondsData && (
        <MarketShareTreemap
          data={marketShareData}
          secondsData={marketShareSecondsData}
        />
      )}
      {dailyTrendsData && <AdDailyTrendsLine data={dailyTrendsData} />}
      {sharedAdData && <SharedAdBar data={sharedAdData} />}
      {topAdData && <TopAdComparisonTable data={topAdData} />}
      {untappedAdData && <UntappedAdTable data={untappedAdData} />}
      {newAdData && <NewAdTable data={newAdData} />}
    </div>
  );
}
