"use client";
import StatCards from "./stat-cards";
import RadioAdHeatmap from "./ad-count-heatmap";
import RadioSectorAnalysis from "./comperative-bar";
import TopAdvertisersComparison from "./top-advertisers-comparison";
import TVChannelTreemap from "./sectors-treemap";
import NewAdvertisersAlerts from "./new-advertisers-alerts";
import SharedAdvertisers from "./shared-advertizers";
import UntappedLeads from "./untapped-leads";
import DailyAdsLineChart from "./daily-ads-line-chart";
import { useState } from "react";
import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";

const radioData = [
  {
    name: 'RADIO_CITY',
    data: [
      { date: '07-05-2025', missingHours: '' },
      { date: '08-05-2025', missingHours: '' },
      { date: '09-05-2025', missingHours: '' },
      { date: '10-05-2025', missingHours: '' },
      { date: '11-05-2025', missingHours: '1 Hour (22)' },
      { date: '12-05-2025', missingHours: '2 Hours (09,19)' },
      { date: '13-05-2025', missingHours: '' },
      { date: '14-05-2025', missingHours: '1 Hour (11)' },
      { date: '15-05-2025', missingHours: '' },
      { date: '16-05-2025', missingHours: '' },
      { date: '17-05-2025', missingHours: '' },
      { date: '18-05-2025', missingHours: '2 Hours (10,19)' },
      { date: '19-05-2025', missingHours: '2 Hours (11,19)' },
      { date: '20-05-2025', missingHours: '2 Hours (10,20)' },
    ],
  },
  {
    name: 'BIG_FM',
    data: [
      { date: '07-05-2025', missingHours: '' },
      { date: '08-05-2025', missingHours: '' },
      { date: '09-05-2025', missingHours: '' },
      { date: '10-05-2025', missingHours: '' },
      { date: '11-05-2025', missingHours: '1 Hour (21)' },
      { date: '12-05-2025', missingHours: '' },
      { date: '13-05-2025', missingHours: '' },
      { date: '14-05-2025', missingHours: '' },
      { date: '15-05-2025', missingHours: '' },
      { date: '16-05-2025', missingHours: '' },
      { date: '17-05-2025', missingHours: '' },
      { date: '18-05-2025', missingHours: '' },
      { date: '19-05-2025', missingHours: '' },
      { date: '20-05-2025', missingHours: '' },
    ],
  },
  {
    name: 'RADIO_MIRCHI',
    data: [
      { date: '07-05-2025', missingHours: '' },
      { date: '08-05-2025', missingHours: '' },
      { date: '09-05-2025', missingHours: '' },
      { date: '10-05-2025', missingHours: '1 Hour (06)' },
      { date: '11-05-2025', missingHours: '1 Hour (22)' },
      { date: '12-05-2025', missingHours: '16 Hours (06 to 21)' },
      { date: '13-05-2025', missingHours: '' },
      { date: '14-05-2025', missingHours: '' },
      { date: '15-05-2025', missingHours: '' },
      { date: '16-05-2025', missingHours: '' },
      { date: '17-05-2025', missingHours: '' },
      { date: '18-05-2025', missingHours: '' },
      { date: '19-05-2025', missingHours: '' },
      { date: '20-05-2025', missingHours: '8 Hours (15 to 22)' },
    ],
  },
  {
    name: 'RED_FM',
    data: [
      { date: '07-05-2025', missingHours: '' },
      { date: '08-05-2025', missingHours: '' },
      { date: '09-05-2025', missingHours: '' },
      { date: '10-05-2025', missingHours: '' },
      { date: '11-05-2025', missingHours: '1 Hour (22)' },
      { date: '12-05-2025', missingHours: 'All Data Missing' },
      { date: '13-05-2025', missingHours: '5 Hours (06 to 10)' },
      { date: '14-05-2025', missingHours: '' },
      { date: '15-05-2025', missingHours: '' },
      { date: '16-05-2025', missingHours: '' },
      { date: '17-05-2025', missingHours: '' },
      { date: '18-05-2025', missingHours: '' },
      { date: '19-05-2025', missingHours: '' },
      { date: '20-05-2025', missingHours: '2 Hours (09, 16)' },
    ],
  },
]

const RadioDashboard = () => {
  const [openAccordions, setOpenAccordions] = useState({});
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const toggleAccordion = (radioName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [radioName]: !prev[radioName],
    }));
  };

  return (
    <div className="space-y-6">
      {showDisclaimer && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex flex-col gap-3 relative">
          <button
            className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
            onClick={() => setShowDisclaimer(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Disclaimer: Some data is missing
              </p>
              <p className="text-sm text-yellow-700">
                The analysis covers a period from 7th May to 20th May, 2025. See
                below for specific missing data details.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {radioData.map((radio) => (
              <div key={radio.name} className="border rounded-md">
                <button
                  className="w-full flex justify-between items-center p-4"
                  onClick={() => toggleAccordion(radio.name)}
                >
                  <span className="font-medium">{radio.name}</span>
                  {openAccordions[radio.name] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {openAccordions[radio.name] && (
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Missing Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {radio.data.map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{row.date}</td>
                            <td className="p-2">{row.missingHours || "None"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
