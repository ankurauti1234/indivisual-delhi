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
import { week19, week20 } from "./top-ad-data";
import { Button } from "@/components/ui/button";

const getUniqueSectors = (week19Data, week20Data) => {
  const combinedSectors = new Set();
  week19Data.forEach((item) => combinedSectors.add(item.Sector));
  week20Data.forEach((item) => combinedSectors.add(item.Sector));
  return Array.from(combinedSectors);
};

const uniqueSectors = getUniqueSectors(week19, week20);

const stationDataByWeek = {
  week19: {
    radiocity: {
      name: "Radio City",
      advertisers: week19.map((item) => ({
        brand: item.Brand,
        ads: item["Radio City"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      advertisers: week19.map((item) => ({
        brand: item.Brand,
        ads: item["Radio Mirchi"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    radioone: {
      name: "Radio One",
      advertisers: week19.map((item) => ({
        brand: item.Brand,
        ads: item["Radio One"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    redfm: {
      name: "Red FM",
      advertisers: week19.map((item) => ({
        brand: item.Brand,
        ads: item["Red FM"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
  },
  week20: {
    radiocity: {
      name: "Radio City",
      advertisers: week20.map((item) => ({
        brand: item.Brand,
        ads: item["Radio City"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      advertisers: week20.map((item) => ({
        brand: item.Brand,
        ads: item["Radio Mirchi"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    radioone: {
      name: "Radio One",
      advertisers: week20.map((item) => ({
        brand: item.Brand,
        ads: item["Radio One"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
    redfm: {
      name: "Red FM",
      advertisers: week20.map((item) => ({
        brand: item.Brand,
        ads: item["Red FM"] || 0,
        sector: item.Sector,
      })).filter((item) => item.ads > 0),
    },
  },
};

const stationOptions = [
  { value: "radiocity", label: "Radio City" },
  { value: "radiomirchi", label: "Radio Mirchi" },
  { value: "radioone", label: "Radio One" },
  { value: "redfm", label: "Red FM" },
];

export default function UntappedLeads() {
  const [selectedStation, setSelectedStation] = useState("radiocity");
  const [selectedWeek, setSelectedWeek] = useState("week19");
  const [selectedSector, setSelectedSector] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentWeekData = stationDataByWeek[selectedWeek];

  const getUntappedLeads = () => {
    const selectedStationAdvertisers = new Set(
      currentWeekData[selectedStation].advertisers.map((a) => a.brand)
    );
    const untappedLeads = [];

    Object.keys(currentWeekData).forEach((station) => {
      if (station !== selectedStation) {
        currentWeekData[station].advertisers.forEach((advertiser) => {
          if (
            !selectedStationAdvertisers.has(advertiser.brand) &&
            (selectedSector === "all" || advertiser.sector === selectedSector)
          ) {
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
                sector: advertiser.sector,
              });
            }
          }
        });
      }
    });

    return untappedLeads.sort((a, b) => b.ads - a.ads);
  };

  const untappedLeads = getUntappedLeads();

  const totalItems = untappedLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLeads = untappedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return `${value.toFixed(0)} Plays`;
  };

  const handleStationChange = (value) => {
    setSelectedStation(value);
    setCurrentPage(1);
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    setCurrentPage(1);
  };

  const handleSectorChange = (value) => {
    setSelectedSector(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const weekLabel = selectedWeek === "week19" ? "19 (May 7-14, 2025)" : "20 (May 15-22, 2025)";

  return (
    <ChartCard
      icon={<Target className="w-6 h-6" />}
      title="Competitor Advertisers NOT on Your Station"
      description={`Untapped Leads Advertising on Competitors - Week ${weekLabel}`}
      action={
        <div className="flex justify-end gap-2">
          <Select onValueChange={handleWeekChange} value={selectedWeek}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week19">Week 19</SelectItem>
              <SelectItem value="week20">Week 20</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleSectorChange} defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {uniqueSectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleStationChange} value={selectedStation}>
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
                <th scope="col" className="px-6 py-3">Sector</th>
                <th scope="col" className="px-6 py-3">Competitor Stations</th>
                <th scope="col" className="px-6 py-3">Plays</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead, index) => (
                  <tr key={lead.brand} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.brand}</td>
                    <td className="px-6 py-4">{lead.sector}</td>
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
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                    No untapped leads found for {currentWeekData[selectedStation].name} in Week {weekLabel}.
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
            Showing {paginatedLeads.length} of {totalItems} untapped leads not advertising on {currentWeekData[selectedStation].name} in Week {weekLabel}
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