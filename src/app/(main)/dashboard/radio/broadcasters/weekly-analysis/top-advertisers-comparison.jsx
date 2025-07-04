"use client";

import { BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { week19, week20 } from "./top-ad-data";

const getTopAdvertisers = (week19Data, week20Data) => {
  const combinedBrands = new Set();
  week19Data.forEach((item) => combinedBrands.add(item.Brand));
  week20Data.forEach((item) => combinedBrands.add(item.Brand));
  return Array.from(combinedBrands);
};

// Derive top advertisers dynamically based on selected week
const getTopAdvertisersForWeek = (weekData) => {
  return [...new Set(weekData.map((item) => item.Brand))];
};

const getUniqueSectors = (week19Data, week20Data) => {
  const combinedSectors = new Set();
  week19Data.forEach((item) => combinedSectors.add(item.Sector));
  week20Data.forEach((item) => combinedSectors.add(item.Sector));
  return Array.from(combinedSectors);
};

const topAdvertisers = getTopAdvertisers(week19, week20);
const uniqueSectors = getUniqueSectors(week19, week20);

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

const advertiserDataByWeek = {
  week19: {
    radiocity: {
      name: "Radio City",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio City"] || 0,
        sector: item.Sector,
      })),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio Mirchi"] || 0,
        sector: item.Sector,
      })),
    },
    radioone: {
      name: "Radio One",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio One"] || 0,
        sector: item.Sector,
      })),
    },
    redfm: {
      name: "Red FM",
      data: week19.map((item) => ({
        advertiser: item.Brand,
        spend: item["Red FM"] || 0,
        sector: item.Sector,
      })),
    },
  },
  week20: {
    radiocity: {
      name: "Radio City",
      data: week20.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio City"] || 0,
        sector: item.Sector,
      })),
    },
    radiomirchi: {
      name: "Radio Mirchi",
      data: week20.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio Mirchi"] || 0,
        sector: item.Sector,
      })),
    },
    radioone: {
      name: "Radio One",
      data: week20.map((item) => ({
        advertiser: item.Brand,
        spend: item["Radio One"] || 0,
        sector: item.Sector,
      })),
    },
    redfm: {
      name: "Red FM",
      data: week20.map((item) => ({
        advertiser: item.Brand,
        spend: item["Red FM"] || 0,
        sector: item.Sector,
      })),
    },
  },
};

export default function TopAdvertisersComparison() {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("week19");
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get advertisers for the selected week
  const weekData = selectedWeek === "week19" ? week19 : week20;
  const topAdvertisers = getTopAdvertisersForWeek(weekData);

  // Initialize selectedAdvertisers with the first advertiser of the selected week
  useEffect(() => {
    setSelectedAdvertisers(topAdvertisers.length > 0 ? [topAdvertisers[0]] : []);
    setCurrentPage(1);
  }, [selectedWeek]);

  const currentWeekData = advertiserDataByWeek[selectedWeek];

  const tableData = topAdvertisers
    .filter((adv) => {
      const advertiserData = weekData.find((item) => item.Brand === adv);
      const matchesSector =
        selectedSector === "all" || advertiserData?.Sector === selectedSector;
      const matchesSearch = adv
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSector && matchesSearch;
    })
    .map((adv) => ({
      advertiser: adv,
      radiocity:
        currentWeekData["radiocity"].data.find((d) => d.advertiser === adv)
          ?.spend || 0,
      radiomirchi:
        currentWeekData["radiomirchi"].data.find((d) => d.advertiser === adv)
          ?.spend || 0,
      radioone:
        currentWeekData["radioone"].data.find((d) => d.advertiser === adv)
          ?.spend || 0,
      redfm:
        currentWeekData["redfm"].data.find((d) => d.advertiser === adv)
          ?.spend || 0,
    }));

  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return `${value.toFixed(0)} Plays`;
  };

  const handleAdvertiserSelectChange = (value) => {
    if (value === "all") {
      setSelectedAdvertisers(topAdvertisers);
      setSearchTerm("");
    } else {
      setSelectedAdvertisers([value]);
      setSearchTerm("");
    }
    setCurrentPage(1);
  };

  const handleWeekSelectChange = (value) => {
    setSelectedWeek(value);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSectorSelectChange = (value) => {
    setSelectedSector(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Top Advertisers Comparison"
      description={`Your Station vs. Competitors for Week ${selectedWeek === "week19" ? "19" : "20"}`}
      action={
        <div className="flex gap-2 items-center justify-end">
          <Select onValueChange={handleWeekSelectChange} value={selectedWeek}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week19">Week 19</SelectItem>
              <SelectItem value="week20">Week 20</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleSectorSelectChange} defaultValue="all">
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
          <Select onValueChange={handleAdvertiserSelectChange} value={selectedAdvertisers[0] || ""}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select or search advertiser" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search advertisers..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mb-2"
                />
              </div>
              <SelectItem value="all">All Advertisers</SelectItem>
              {topAdvertisers
                .filter((adv) => {
                  const advertiserData = weekData.find(
                    (item) => item.Brand === adv
                  );
                  return (
                    adv.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedSector === "all" ||
                      advertiserData?.Sector === selectedSector)
                  );
                })
                .map((adv) => (
                  <SelectItem key={adv} value={adv}>
                    {adv}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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
            Showing {paginatedData.length} of {totalItems} advertisers for Week{" "}
            {selectedWeek === "week19" ? "19" : "20"}
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