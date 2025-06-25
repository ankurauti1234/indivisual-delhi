"use client";

import { BarChart2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ChartCard from "@/components/card/charts-card";
import { week19 } from "./top-ad-data"; // Import the JSON data for Week 19

// Function to calculate all unique advertisers
const getTopAdvertisers = (week19Data) => {
  const combinedBrands = new Set();
  week19Data.forEach((item) => combinedBrands.add(item.Brand));
  return Array.from(combinedBrands);
};

// Get all advertisers
const topAdvertisers = getTopAdvertisers(week19);

// Create chart configuration for the advertisers
const chartConfig = {
  radiocity: { label: "Radio City", color: "hsl(var(--chart-1))" },
  radiomirchi: { label: "Radio Mirchi", color: "hsl(var(--chart-2))" },
  radioone: { label: "Radio One", color: "hsl(var(--chart-3))" },
  redfm: { label: "Red FM", color: "hsl(var(--chart-4))" },
  ...Object.fromEntries(
    topAdvertisers.map((adv, index) => [
      adv,
      { label: adv, color: `hsl(var(--chart-${(index % 10) + 1}))` },
    ])
  ),
};

// Prepare data for the table
const advertiserDataByWeek = {
  week19: {
    radiocity: {
      name: "Radio City",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio City"] || 0,
      })),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio Mirchi"] || 0,
      })),
    },
    radioone: {
      name: "Radio One",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio One"] || 0,
      })),
    },
    redfm: {
      name: "Red FM",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Red FM"] || 0,
      })),
    },
  },
};

export default function TopAdvertisersComparison() {
  const [selectedWeek, setSelectedWeek] = useState("week19");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current week's data
  const currentWeekData = advertiserDataByWeek[selectedWeek];

  // Prepare data for table
  const tableData = topAdvertisers
    .filter((adv) => adv.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((adv) => ({
      advertiser: adv,
      radiocity: currentWeekData["radiocity"].data.find((d) => d.advertiser === adv)?.spend || 0,
      radiomirchi: currentWeekData["radiomirchi"].data.find((d) => d.advertiser === adv)?.spend || 0,
      radioone: currentWeekData["radioone"].data.find((d) => d.advertiser === adv)?.spend || 0,
      redfm: currentWeekData["redfm"].data.find((d) => d.advertiser === adv)?.spend || 0,
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
      description="Your Station vs. Competitors - Week 19 (May 7-14, 2025)"
      action={
        <div className="flex gap-2 items-center justify-end">
          <Select onValueChange={setSelectedWeek} value={selectedWeek}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week19">Week 19</SelectItem>
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
      chart={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advertiser</TableHead>
                <TableHead>Radio City</TableHead>
                <TableHead>Radio Mirchi</TableHead>
                <TableHead>Radio One</TableHead>
                <TableHead>Red FM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.advertiser}>
                  <TableCell>{row.advertiser}</TableCell>
                  <TableCell>{formatCurrency(row.radiocity)}</TableCell>
                  <TableCell>{formatCurrency(row.radiomirchi)}</TableCell>
                  <TableCell>{formatCurrency(row.radioone)}</TableCell>
                  <TableCell>{formatCurrency(row.redfm)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center text-sm text-gray-500">
          <p>
            Showing {paginatedData.length} of {totalItems} advertisers for Week 19
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