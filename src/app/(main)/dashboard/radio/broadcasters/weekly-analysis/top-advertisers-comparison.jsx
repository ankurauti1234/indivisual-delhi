"use client";

import { BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { week16, week17 } from "./top-ad-data"; // Import the JSON data
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Function to calculate all unique advertisers
const getTopAdvertisers = (week16Data, week17Data) => {
  const combinedBrands = new Set();
  week16Data.forEach((item) => combinedBrands.add(item.Brand));
  week17Data.forEach((item) => combinedBrands.add(item.Brand));
  return Array.from(combinedBrands);
};

// Get all advertisers
const topAdvertisers = getTopAdvertisers(week16, week17);

// Create chart configuration for the advertisers
const chartConfig = {
  mangofm: { label: "Mango FM", color: "hsl(var(--chart-1))" },
  redfm: { label: "Red FM", color: "hsl(var(--chart-2))" },
  clubfm: { label: "Club FM", color: "hsl(var(--chart-3))" },
  radiomirchi: { label: "Radio Mirchi", color: "hsl(var(--chart-4))" },
  ...Object.fromEntries(
    topAdvertisers.map((adv, index) => [
      adv,
      { label: adv, color: `hsl(var(--chart-${(index % 10) + 1}))` },
    ])
  ),
};

// Prepare data for the chart
const advertiserDataByWeek = {
  week16: {
    mangofm: {
      name: "Mango FM",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Mango FM"] || 0,
      })),
    },
    redfm: {
      name: "Red FM",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Red FM"] || 0,
      })),
    },
    clubfm: {
      name: "Club FM",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Club FM"] || 0,
      })),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio Mirchi"] || 0,
      })),
    },
  },
  week17: {
    mangofm: {
      name: "Mango FM",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Mango FM"] || 0,
      })),
    },
    redfm: {
      name: "Red FM",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Red FM"] || 0,
      })),
    },
    clubfm: {
      name: "Club FM",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Club FM"] || 0,
      })),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio Mirchi"] || 0,
      })),
    },
  },
};

export default function TopAdvertisersComparison() {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState([topAdvertisers[0]]);
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current week's data
  const currentWeekData = advertiserDataByWeek[selectedWeek];

  // Prepare data for horizontal stacked chart
  const chartData = [
    {
      station: "mangofm",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["mangofm"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
    {
      station: "redfm",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["redfm"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
    {
      station: "clubfm",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["clubfm"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
    {
      station: "radiomirchi",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["radiomirchi"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
  ];

  // Prepare data for table
  const tableData = topAdvertisers
    .filter((adv) => adv.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((adv) => ({
      advertiser: adv,
      mangofm: currentWeekData["mangofm"].data.find((d) => d.advertiser === adv)?.spend || 0,
      redfm: currentWeekData["redfm"].data.find((d) => d.advertiser === adv)?.spend || 0,
      clubfm: currentWeekData["clubfm"].data.find((d) => d.advertiser === adv)?.spend || 0,
      radiomirchi: currentWeekData["radiomirchi"].data.find((d) => d.advertiser === adv)?.spend || 0,
    }));

  // Pagination logic
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return `${value} Spots`; // Adjust based on what the numbers represent
  };

  const handleAdvertiserSelectChange = (value) => {
    if (value === "all") {
      setSelectedAdvertisers(topAdvertisers);
    } else {
      setSelectedAdvertisers([value]);
    }
  };

  const handleWeekSelectChange = (value) => {
    setSelectedWeek(value);
    setCurrentPage(1); // Reset to first page when week changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Top Advertisers Comparison"
      description={`Your Station vs. Competitors - ${selectedWeek === "week16" ? "Week 16" : "Week 17"} 2024`}
      action={
        <div className="flex gap-2 items-center justify-end">
         
          <Select onValueChange={handleWeekSelectChange} defaultValue="week16">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">Week 16</SelectItem>
              <SelectItem value="week17">Week 17</SelectItem>
            </SelectContent>
          </Select>
          <Input
              placeholder="Search advertisers..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-48"
            />
        </div>
      }
      chart={<div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advertiser</TableHead>
                  <TableHead>Mango FM</TableHead>
                  <TableHead>Red FM</TableHead>
                  <TableHead>Club FM</TableHead>
                  <TableHead>Radio Mirchi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {  paginatedData.map((row) => (
                  <TableRow key={row.advertiser}>
                    <TableCell>{row.advertiser}</TableCell>
                    <TableCell>{formatCurrency(row.mangofm)}</TableCell>
                    <TableCell>{formatCurrency(row.redfm)}</TableCell>
                    <TableCell>{formatCurrency(row.clubfm)}</TableCell>
                    <TableCell>{formatCurrency(row.radiomirchi)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
      }
      footer={
        <div className="flex w-full justify-between items-center text-sm text-gray-500">
            <p>
              Showing {paginatedData.length} of {totalItems} advertisers for {selectedWeek === "week16" ? "Week 16" : "Week 17"}
            </p>
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
          </div>
      }
    />
  );
}