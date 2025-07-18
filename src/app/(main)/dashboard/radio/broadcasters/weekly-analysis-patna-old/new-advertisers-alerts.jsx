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

// New advertiser data for each station (Week 20: 16-04-2025 to 30-04-2025)
const newAdvertiserData = {
  bigfm: {
    name: "Big FM",
    advertisers: [
      "ALLEN CAREER INSTITUTE",
      "DAVA INDIA",
      "INTEGRAL UNIVERSITY",
      "IPCA",
      "JAY PRABHA MEDANTA",
      "KAPKAPIII",
      "SMEDAZ HOSPITALI",
      "METLIFE",
      "MINISTRY OF HEALTH AND FAMILY WELFARE",
      "RAYMOND",
      "VI",
    ]
  },
radiocity: {
  name: "Radio City",
  advertisers: [
    "ALLEN CAREER INSTITUTE",
    "BIG APOLLO SPECTRA HOSPITAL",
    "DENTAL BRACES CONSULTATION SERVICES",
    "DR NAVEEN KUMAR – PATNA CANCER CENTER",
    "DR ORTHO",
    "DR. BAIDYA DIAGNOSTIC LABORATORY PVT LTD",
    "FEDERAL BANK",
    "HAJIPUR SHOWROOM",
    "INTEGRAL UNIVERSITY",
    "KAPILA PASHU AAHAR",
    "KAPKAPIII",
    "MANPURAM",
    "MEDI-CAPS UNIVERSITY",
    "MINISTRY OF HEALTH AND FAMILY WELFARE",
    "MINISTRY OF HEALTH&FAMILY WELFARE (INDIA)",
    "PUNJAB NATIONAL BANK",
    "PUNJAB NATIONAL BANK (PNB)",
    "RAYMOND",
    "RERA ACT",
    "SATYAVRAT HOSPITAL",
    "UNCAP",
    "VADILAL",
    "VIDYAMANDIR CLASSES",
    "XAVIER UNIVERSITY"
  ]
},
radiomirchi: {
  name: "Radio Mirchi",
  advertisers: [
    "4A HEART HOSPITAL",
    "ALLEN CAREER INSTITUTE",
    "BANSAL CLASSES",
    "BIG APOLLO HOSPITAL",
    "BOOK MY SHOW",
    "CONSUMER TECH",
    "DAVA INDIA",
    "DO NOT DISTURB(DND) APP",
    "HAMDARD",
    "HEALTH TIPS",
    "HERO CYCLES",
    "INTEGRAL UNIVERSITY",
    "JAGRAN PRAKASHAN LIMITED",
    "JAMIA HAMDARD UNIVERSITY",
    "JAY PRABHA MEDANTA",
    "KENSTAR",
    "MANGO FEST",
    "MINISTRY OF HEALTH&FAMILY WELFARE (INDIA)",
    "NIFT PATNA",
    "RAYMOND",
    "SALUJA",
    "SWARRNIM UNIVERSITY",
    "VEDANTA HEART COMMAND CENTRE"
  ]
},
redfm: {
  name: "Red FM",
  advertisers: [
    "ALLEN CAREER INSTITUTE",
    "BHOPAL UNIVERSITY",
    "DISNEYLAND",
    "GAUTAM BUDDHA UNIVERSITY (GBU)",
    "GROWMED VITAMIN BABY OIL",
    "ICDS WOMEN AND CHILD HEALTH",
    "INTEGRAL UNIVERSITY",
    "KENSTAR",
    "MINISTRY OF EDUCATION",
    "MOTHERHOOD CARE",
    "PANCHAYATI RAJ VIBHAG",
    "PATANJALI",
    "RAYMOND",
    "RBI",
    "SARBOTTAM",
    "SIDDHIVINAYAK AUTOMOBILES",
    "TIMEZONE",
    "VIDYAMANDIR CLASSES"
  ]
}
};

// Available stations
const stationOptions = [
  { value: "bigfm", label: "Big FM" },
  { value: "radiocity", label: "Radio CIty" },
  { value: "radiomirchi", label: "Radio Mirchi" },
  { value: "redfm", label: "Red FM" }
];

// Available weeks
const weekOptions = [
  { value: "week19", label: "Week 19" },
  { value: "week20", label: "Week 20" }
];

export default function NewAdvertisersAlerts() {
  const [selectedStations, setSelectedStations] = useState(["bigfm"]);
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
  const selectedData = selectedWeek === "week20" 
    ? selectedStations.map(station => ({
        name: newAdvertiserData[station].name,
        advertisers: newAdvertiserData[station].advertisers
      }))
    : [];

  // Combine advertisers from all selected stations and remove duplicates
  const combinedAdvertisers = Array.from(
    new Set(selectedData.flatMap(data => data.advertisers))
  );

  return (
    <ChartCard
      icon={<AlertCircle className="w-6 h-6" />}
      title="New Advertiser Alerts"
      description="Brands Recently Appearing on Competitors (16-04-2025 to 30-04-2025)"
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} defaultValue="week20">
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
          {selectedWeek === "week19" ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-lg">No previous week data available</p>
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
                          .filter(data => data.advertisers.includes(advertiser))
                          .map(data => data.name)
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
        selectedWeek === "week19" ? null : (
          <p className="text-sm text-gray-500">
            Total: {combinedAdvertisers.length} new advertisers across {selectedStations.length} station(s)
          </p>
        )
      }
    />
  );
}