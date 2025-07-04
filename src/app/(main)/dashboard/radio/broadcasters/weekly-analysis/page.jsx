"use client";
import React from "react";
import StatCards from "./stat-cards";
import RadioAdHeatmap from "./ad-count-heatmap";
import RadioSectorAnalysis from "./comperative-bar";
import TopAdvertisersComparison from "./top-advertisers-comparison";
import TVChannelTreemap from "./sectors-treemap";
import SharedAdvertisers from "./shared-advertizers";
import UntappedLeads from "./untapped-leads";
import DailyAdsLineChart from "./daily-ads-line-chart";
import NewAdvertisersAlerts from "./new-advertisers-alerts";
import { Table, AlertTriangle } from "lucide-react";
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'

const RadioDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">
            Disclaimer: Some data is unavailable
          </p>
          <p className="text-sm text-yellow-700">
            For Radio One, data is available on 11th May. For Radio Mirchi, data
            is available on 14th May at 10:00. For Radio One, data is unavailable on
            15th May from 10:00 to 20:00. For Radio City, data for the 3rd hour
            on 17th May is incomplete.
          </p>
        </div>
      </div>
      <StatCards />
      <RadioAdHeatmap />
      <RadioSectorAnalysis />
      <TVChannelTreemap />
      <DailyAdsLineChart />
      <TopAdvertisersComparison />
      <UntappedLeads />
      <SharedAdvertisers />
      <NewAdvertisersAlerts />
    </div>
  );
};

export default RadioDashboard;
