"use client";

import { Target } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";
import { week16, week17 } from "./top-ad-data"; // Import the JSON data
import { Button } from "@/components/ui/button";

// Derive station data from week16 and week17
const stationDataByWeek = {
  week16: {
    mangofm: {
      name: "Mango FM",
      advertisers: week16.map((item) => ({
        brand: item.Brand,
        ads: item["Mango FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    redfm: {
      name: "Red FM",
      advertisers: week16.map((item) => ({
        brand: item.Brand,
        ads: item["Red FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    clubfm: {
      name: "Club FM",
      advertisers: week16.map((item) => ({
        brand: item.Brand,
        ads: item["Club FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      advertisers: week16.map((item) => ({
        brand: item.Brand,
        ads: item["Radio Mirchi"] || 0,
      })).filter((item) => item.ads > 0),
    },
  },
  week17: {
    mangofm: {
      name: "Mango FM",
      advertisers: week17.map((item) => ({
        brand: item.Brand,
        ads: item["Mango FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    redfm: {
      name: "Red FM",
      advertisers: week17.map((item) => ({
        brand: item.Brand,
        ads: item["Red FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    clubfm: {
      name: "Club FM",
      advertisers: week17.map((item) => ({
        brand: item.Brand,
        ads: item["Club FM"] || 0,
      })).filter((item) => item.ads > 0),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      advertisers: week17.map((item) => ({
        brand: item.Brand,
        ads: item["Radio Mirchi"] || 0,
      })).filter((item) => item.ads > 0),
    },
  },
};

// List of stations
const stationOptions = [
  { value: "mangofm", label: "Mango FM" },
  { value: "redfm", label: "Red FM" },
  { value: "clubfm", label: "Club FM" },
  { value: "radiomirchi", label: "Radio Mirchi" },
];

export default function UntappedLeads() {
  const [selectedStation, setSelectedStation] = useState("mangofm");
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current week's data
  const currentWeekData = stationDataByWeek[selectedWeek];

  // Get brands that advertise on other stations but not on the selected station
  const getUntappedLeads = () => {
    const selectedStationAdvertisers = new Set(
      currentWeekData[selectedStation].advertisers.map((a) => a.brand)
    );
    const untappedLeads = [];

    // Collect brands from other stations
    Object.keys(currentWeekData).forEach((station) => {
      if (station !== selectedStation) {
        currentWeekData[station].advertisers.forEach((advertiser) => {
          if (!selectedStationAdvertisers.has(advertiser.brand)) {
            const existingLead = untappedLeads.find(
              (lead) => lead.brand === advertiser.brand
            );
            if (existingLead) {
              existingLead.stations.push(currentWeekData[station].name);
              existingLead.ads += advertiser.ads;
            } else {
              untappedLeads.push({
                brand: advertiser.brand,
                stations: [currentWeekData[station].name],
                ads: advertiser.ads,
              });
            }
          }
        });
      }
    });

    // Sort by number of ads (descending) for better prioritization
    return untappedLeads.sort((a, b) => b.ads - a.ads);
  };

  const untappedLeads = getUntappedLeads();

  // Pagination logic
  const totalItems = untappedLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLeads = untappedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return `${value} Units`; // Adjust based on what the numbers represent
  };

  const handleStationChange = (value) => {
    setSelectedStation(value);
    setCurrentPage(1); // Reset to first page when station changes
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    setCurrentPage(1); // Reset to first page when week changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ChartCard
      icon={<Target className="w-6 h-6" />}
      title="Competitor Advertisers NOT on Your Station"
      description={`Untapped Leads Advertising on Competitors - ${
        selectedWeek === "week16" ? "Week 16" : "Week 17"
      } (2024)`}
      action={
        <div className="flex justify-end gap-2">
          <Select onValueChange={handleWeekChange} defaultValue="week16">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">Week 16</SelectItem>
              <SelectItem value="week17">Week 17</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleStationChange} defaultValue="mangofm">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Brand</th>
                <th scope="col" className="px-6 py-3">Competitor Stations</th>
                <th scope="col" className="px-6 py-3">Spend (Units)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead, index) => (
                  <tr key={lead.brand} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.brand}</td>
                    <td className="px-6 py-4">{lead.stations.join(", ")}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatCurrency(lead.ads)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    No untapped leads found for {currentWeekData[selectedStation].name} in {selectedWeek === 'week16' ? 'Week 16' : 'Week 17'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center text-sm text-gray-500">
          <p>
            Showing {paginatedLeads.length} of {totalItems} untapped leads not advertising on {currentWeekData[selectedStation].name} in {selectedWeek === "week16" ? "Week 16" : "Week 17"}
          </p>
          {totalItems > itemsPerPage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
}