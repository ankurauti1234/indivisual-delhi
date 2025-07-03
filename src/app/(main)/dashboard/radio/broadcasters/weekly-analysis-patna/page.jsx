'use client'
import StatCards from './stat-cards'
import RadioAdHeatmap from './ad-count-heatmap'
import RadioSectorAnalysis from './comperative-bar'
import TopAdvertisersComparison from './top-advertisers-comparison'
import TVChannelTreemap from './sectors-treemap'
import NewAdvertisersAlerts from './new-advertisers-alerts'
import SharedAdvertisers from './shared-advertizers'
import UntappedLeads from './untapped-leads'
import DailyAdsLineChart from './daily-ads-line-chart'

const RadioDashboard = () => {
  return (
    <div className='space-y-6'>
      <StatCards />
      <RadioAdHeatmap />
      <RadioSectorAnalysis />
      <TVChannelTreemap />
      <DailyAdsLineChart/>
      <TopAdvertisersComparison />
      <UntappedLeads />
      <SharedAdvertisers />
      <NewAdvertisersAlerts />
  
    </div>
  );
}

export default RadioDashboard


