"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  "A table showing untapped ad opportunities by brand, sector, and competitor stations with sector and station filters";

// Custom Toggle Component
const CustomToggle = ({ pressed, onPressedChange, children, className }) => {
  return (
    <button
      onClick={() => onPressedChange(!pressed)}
      className={`px-4 py-2 rounded-md border transition-colors ${
        pressed
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white text-black border-gray-300 hover:bg-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Custom Pagination Components
const CustomPagination = ({ children }) => (
  <div className="flex items-center justify-center gap-2">{children}</div>
);

const CustomPaginationPrevious = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md border ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
    }`}
  >
    Previous
  </button>
);

const CustomPaginationLink = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md border ${
      isActive ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-100"
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
      disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
    }`}
  >
    Next
  </button>
);

const CustomPaginationEllipsis = () => <span className="px-3 py-1">...</span>;

const UntappedAdTable = ({ data }) => {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [showAirtime, setShowAirtime] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derive options
  const sectorOptions = data.sectors.map((sector) => ({
    value: sector.name,
    label: sector.name,
  }));
  const stationOptions = data.stations.map((station) => ({
    value: station,
    label: station,
  }));

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data.data
      .filter((brand) => {
        // Sector filter
        const matchesSector =
          selectedSectors.length === 0 ||
          selectedSectors.some((s) => s.value === brand.sector);

        // Station filter: include brands where all selected stations have 0 adCount or airtime
        const matchesStations =
          selectedStations.length === 0 ||
          selectedStations.every((sel) => {
            const stationData = brand.stations.find(
              (s) => s.station === sel.value
            );
            return (
              !stationData ||
              (showAirtime
                ? stationData.airtime === 0
                : stationData.adCount === 0)
            );
          });

        return matchesSector && matchesStations;
      })
      .map((brand) => {
        // Include only stations with non-zero values for display
        const filteredStations = brand.stations.filter((s) =>
          showAirtime ? s.airtime > 0 : s.adCount > 0
        );
        // Only include brands with at least one station to display
        if (filteredStations.length === 0) return null;
        return {
          ...brand,
          stations: filteredStations,
          totalValue: filteredStations.reduce(
            (sum, s) => sum + (showAirtime ? s.airtime : s.adCount),
            0
          ),
        };
      })
      .filter((brand) => brand !== null) // Remove brands with no stations
      .sort((a, b) => b.totalValue - a.totalValue); // Sort by totalValue in descending order
  }, [data, selectedSectors, selectedStations, showAirtime]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate pagination range
  const getPaginationRange = () => {
    const maxPagesToShow = 5; // Show up to 5 page numbers (excluding first, last, and ellipses)
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate the range of pages to show around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Add pages in the range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page if totalPages > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Untapped Ad Opportunities</CardTitle>
          <CardDescription>
            {showAirtime ? "Ad airtime (seconds)" : "Ad spots"}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <MultipleSelector
            value={selectedSectors}
            onChange={setSelectedSectors}
            defaultOptions={sectorOptions}
            placeholder="Select sectors"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No sectors found</p>
            }
            className="max-w-64 w-full"
          />
          <MultipleSelector
            value={selectedStations}
            onChange={setSelectedStations}
            defaultOptions={stationOptions}
            placeholder="Select stations to include (0 count)"
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No stations found</p>
            }
            className="max-w-64 w-full"
          />
          <CustomToggle
            pressed={showAirtime}
            onPressedChange={setShowAirtime}
            className="w-full"
          >
            {showAirtime ? "Show Ad spots" : "Show Airtime (s)"}
          </CustomToggle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Competitor Stations</TableHead>
              <TableHead>
                {showAirtime ? "Airtime (seconds)" : "Ad spots"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((brand, index) => (
              <TableRow key={index}>
                <TableCell>{brand.brand}</TableCell>
                <TableCell>{brand.sector}</TableCell>
                <TableCell>
                  {brand.stations
                    .map((s) =>
                      showAirtime
                        ? `(${s.airtime} sec) ${s.station}`
                        : `(${s.adCount}) ${s.station}`
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {brand.totalValue}
                  {showAirtime ? " sec" : ""}
                </TableCell>
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
          {getPaginationRange().map((page, index) =>
            page === "ellipsis" ? (
              <CustomPaginationEllipsis key={`ellipsis-${index}`} />
            ) : (
              <CustomPaginationLink
                key={page}
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </CustomPaginationLink>
            )
          )}
          <CustomPaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </CustomPagination>
      </CardFooter>
    </Card>
  );
};

export default UntappedAdTable;
