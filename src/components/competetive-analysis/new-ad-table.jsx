/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector from "@/components/ui/multiselect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const description =
  "A table listing new advertisements with filters for stations and weeks";

// Custom Pagination Components
const CustomPagination = ({ children }) => (
  <div className="flex items-center justify-center gap-2">{children}</div>
);

const CustomPaginationPrevious = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md border ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100"
    }`}
  >
    Previous
  </button>
);

const CustomPaginationLink = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md border ${
      isActive
        ? "bg-blue-500 text-white border-blue-500"
        : "hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const CustomPaginationNext = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md border ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-100"
    }`}
  >
    Next
  </button>
);

const NewAdTable = ({ data }) => {
  const [selectedWeek, setSelectedWeek] = useState(data.weeks[0] || "");
  const [selectedStations, setSelectedStations] = useState([
    { value: data.stations[0], label: data.stations[0] },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derive options
  const weekOptions = data.weeks.map((week) => ({
    value: week,
    label: week,
  }));
  const stationOptions = data.stations.map((station) => ({
    value: station,
    label: station,
  }));

  // Filter data
  const filteredData = useMemo(() => {
    return data.data.filter((ad) => {
      const matchesWeek = !selectedWeek || ad.week === selectedWeek;
      const matchesStation =
        selectedStations.length === 0 ||
        selectedStations.some((s) => s.value === ad.station);
      return matchesWeek && matchesStation;
    });
  }, [data, selectedWeek, selectedStations]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>New Advertisements</CardTitle>
          <CardDescription>
            New ads for {selectedWeek} on selected stations
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((week) => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <MultipleSelector
            value={selectedStations}
            onChange={setSelectedStations}
            defaultOptions={stationOptions}
            placeholder="Select stations"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p className="text-center text-sm">No stations found</p>}
            className="max-w-64 w-full"
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Advertiser</TableHead>
              <TableHead>Station</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((ad, index) => (
              <TableRow key={index}>
                <TableCell>{ad.advertiser}</TableCell>
                <TableCell>{ad.station}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <CustomPagination>
          <CustomPaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <CustomPaginationLink
              key={page}
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </CustomPaginationLink>
          ))}
          <CustomPaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </CustomPagination>
      </CardFooter>
    </Card>
  );
};

export default NewAdTable;