'use client'
import React from 'react'
import StatCards from './stat-cards'
import RadioAdHeatmap from './ad-count-heatmap'
import RadioSectorAnalysis from './comperative-bar'
import TVChannelTreemap from './sectors-treemap'
import DailyAdsLineChart from './daily-ads-line-chart'

const RadioDashboard = () => {
  return (
    <div className='space-y-6'>
      <StatCards />
      <RadioAdHeatmap />
      <RadioSectorAnalysis />
      <TVChannelTreemap />
      <DailyAdsLineChart />
    </div>
  );
}

export default RadioDashboard