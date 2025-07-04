"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";

// New advertiser data for each station
const newAdvertiserData = {
  week19: {
    radiocity: { name: "Radio City", advertisers: [] },
    radiomirchi: { name: "Radio Mirchi", advertisers: [] },
    radioone: { name: "Radio One", advertisers: [] },
    redfm: { name: "Red FM", advertisers: [] },
  },
  week20: {
    radiocity: {
      name: "Radio City",
      advertisers: [
        "ACE VERDE",
        "ALLEN CAREER INSTITUTE",
        "CAREER LAUNCHER",
        "DO NOT DISTURB(DND)",
        "ELECTRONIC MART JANAKPURI",
        "ENDORSED ORTHODONTICS",
        "GAUTAM BUDDHA UNIVERSITY(GBU)",
        "GLA UNIVERSITY",
        "GMADA",
        "GO GREEN AND CLEAN BY POWERGRID",
        "HEALTH MINISTRY OF INDIA",
        "HSVP",
        "I.T.S COLLEGE",
        "JURASIK PARK",
        "MAHINDRA",
        "PUNJAB NATIONAL BANK",
        "RATRA DENTAL CENTER",
        "SAREGAMA",
        "SBI",
        "SHYAM BALRAM",
        "SKODA",
      ],
    },
    radiomirchi: {
      name: "Radio Mirchi",
      advertisers: [
        "ACE VERDE",
        "ALLEN CAREER INSTITUTE",
        "BARBEQUE NATION",
        "CARATLANE",
        "CARRER LAUNCHER",
        "CULT.FIT",
        "DABUR",
        "DAVA INDIA",
        "DO NOT DISTURB(DND)",
        "ELECTRONICS MART JANAKPURI",
        "GARWARE",
        "GLA UNIVERSITY",
        "GOVERNMENT OF PUNJAB",
        "HAMDARD ROOHAFZA",
        "HARYANA SHEHRI VIKAS PRADHIKARAN",
        "HITACHI",
        "HOUSEFULL 5 (2025)",
        "INDIAN SOCIETY FOR CLINICAL RESEARCH (ISCR)",
        "JIOMART",
        "JURASIK PARK INN",
        "LODHA – GOLDEN TRIANGLE",
        "NARAYANA HOSPITAL",
        "SKODA",
        "TATA MOTORS",
        "V DOT",
        "VI 5G MOBILE NETWORK",
        "ZUNO HEALTH INSURANCE",
      ],
    },
    radioone: {
      name: "Radio One",
      advertisers: [
        "CULT.FIT",
        "FRANCHISE INDIA EXPO 2025",
        "HT MEDIA",
        "LOUIS PHILIPPE",
        "RADIO ONE",
      ],
    },
    redfm: {
      name: "Red FM",
      advertisers: [
        "ALLEN CAREER INSTITUTE",
        "BASKIN-ROBBINS",
        "BHARATI VIDYAPEETH DELHI",
        "BRICK&BOLT",
        "CRAFT HOMES",
        "DELHI PUBLIC SCHOOL",
        "DO NOT DISTURB(DND)",
        "DR ACHAL GARAK",
        "DR AJAY BHALLA",
        "DR. LALIT SHARMA",
        "DR. RAHUL",
        "DR. SHARAD MALHOTRA",
        "DR. ZUBIN DEV SHARMA",
        "DR.ROHAN",
        "ELECTRONICS MART JANAKPURI",
        "GAUTAM BUDDHA UNIVERSITY(GBU)",
        "HAMDARD ROOHAFZA",
        "HARYANA SHEHRI VIKAS PRADHIKARAN",
        "HITACHI",
        "IILM UNIVERSITY",
        "IPC INTERNATIONAL EDUCATION",
        "LIC",
        "LOUIS PHILIPPE-AMBIENCE MALL",
        "MINISTRY OF EDUCATION",
        "MUTUAL FUND",
        "NIC",
        "PANDIT JEWELS",
        "PURAB PREMIUM APARTMENT-SECTOR 88-MOHALI",
        "SAFAL STORE",
        "SKODA",
        "TIMEZONE",
        "VI 5G MOBILE NETWORK",
        "VIDYA MANDIR",
      ],
    },
  },
};

// Available stations
const stationOptions = [
  { value: "radiocity", label: "Radio City" },
  { value: "radiomirchi", label: "Radio Mirchi" },
  { value: "radioone", label: "Radio One" },
  { value: "redfm", label: "Red FM" },
];

// Available weeks
const weekOptions = [
  { value: "week19", label: "Week 19 (May 7-14, 2025)" },
  { value: "week20", label: "Week 20 (May 15-22, 2025)" },
];

export default function NewAdvertisersAlerts() {
  const [selectedStations, setSelectedStations] = useState(["radiocity"]);
  const [selectedWeek, setSelectedWeek] = useState("week20");

  // Handle station selection
  const handleStationChange = (station) => {
    if (selectedStations.includes(station)) {
      // Prevent deselecting the last station
      if (selectedStations.length > 1) {
        setSelectedStations(selectedStations.filter((s) => s !== station));
      }
    } else {
      setSelectedStations([...selectedStations, station]);
    }
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  // Get data for selected stations
  const selectedData = newAdvertiserData[selectedWeek]
    ? selectedStations.map((station) => ({
        name: newAdvertiserData[selectedWeek][station].name,
        advertisers: newAdvertiserData[selectedWeek][station].advertisers,
      }))
    : [];

  // Combine advertisers from all selected stations and remove duplicates
  const combinedAdvertisers = Array.from(
    new Set(selectedData.flatMap((data) => data.advertisers))
  );

  const weekLabel = selectedWeek === "week19" ? "19 (May 7-14, 2025)" : "20 (May 15-22, 2025)";

  return (
    <ChartCard
      icon={<AlertCircle className="w-6 h-6" />}
      title="New Advertiser Alerts"
      description={`Brands Recently Appearing on Competitors - Week ${weekLabel}`}
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} value={selectedWeek}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select stations" />
              </SelectTrigger>
              <SelectContent>
                {stationOptions.map((option) => (
                  <div key={option.value} className="flex items-center px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedStations.includes(option.value)}
                      onChange={() => handleStationChange(option.value)}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      chart={
        <div className="w-full">
          {combinedAdvertisers.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-lg">
                No new advertiser data available for Week {weekLabel}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">New Advertiser</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Stations</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedAdvertisers.map((advertiser, index) => (
                    <tr key={advertiser} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="p-3 font-medium">{advertiser}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          New
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {selectedData
                          .filter((data) => data.advertisers.includes(advertiser))
                          .map((data) => data.name)
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      }
      footer={
        combinedAdvertisers.length === 0 ? null : (
          <p className="text-sm text-gray-500">
            Total: {combinedAdvertisers.length} new advertisers across {selectedStations.length} station(s) in Week {weekLabel}
          </p>
        )
      }
    />
  );
}