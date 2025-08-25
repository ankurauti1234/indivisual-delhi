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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

export const description =
  "A table comparing top advertisers by sector and station with sector and advertiser filters";

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

// Custom Command Components
const CustomCommand = ({ children }) => (
  <div className="border rounded-md bg-white">{children}</div>
);

const CustomCommandInput = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 border-b outline-none"
  />
);

const CustomCommandList = ({ children }) => (
  <div className="max-h-[200px] overflow-y-auto">{children}</div>
);

const CustomCommandEmpty = ({ children }) => (
  <div className="p-2 text-center text-sm text-gray-500">{children}</div>
);

const CustomCommandGroup = ({ children }) => <div>{children}</div>;

const CustomCommandItem = ({ value, onSelect, selected, children }) => (
  <div
    onClick={() => onSelect(value)}
    className={`p-2 flex items-center cursor-pointer hover:bg-gray-100 ${
      selected ? "bg-gray-50" : ""
    }`}
  >
    <Check
      className={`mr-2 h-4 w-4 ${selected ? "opacity-100" : "opacity-0"}`}
    />
    {children}
  </div>
);

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

const TopAdComparisonTable = ({ data }) => {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("");
  const [showAirtime, setShowAirtime] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Derive options
  const sectorOptions = data.sectors.map((sector) => ({
    value: sector.name,
    label: sector.name,
  }));
  const advertiserOptions = useMemo(() => {
    const advertisers = new Set();
    data.data.forEach((ad) => advertisers.add(ad.advertiser));
    return Array.from(advertisers).map((advertiser) => ({
      value: advertiser,
      label: advertiser,
    }));
  }, [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data.data
      .filter((ad) => {
        const matchesSector =
          selectedSectors.length === 0 ||
          selectedSectors.some((s) => s.value === ad.sector);
        const matchesAdvertiser =
          !selectedAdvertiser || ad.advertiser === selectedAdvertiser;
        return matchesSector && matchesAdvertiser;
      })
      .map((ad) => ({
        ...ad,
        totalValue: ad.stations.reduce(
          (sum, s) => sum + (showAirtime ? s.airtime : s.adCount),
          0
        ),
      }))
      .sort((a, b) => b.totalValue - a.totalValue); // Sort by totalValue in descending order
  }, [data, selectedSectors, selectedAdvertiser, showAirtime]);

  // Filtered advertiser options for search
  const filteredAdvertiserOptions = useMemo(() => {
    return advertiserOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [advertiserOptions, searchTerm]);

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
          <CardTitle>Top Advertisers Comparison</CardTitle>
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
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-[200px] justify-between"
              >
                {selectedAdvertiser || "Select advertiser"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <CustomCommand>
                <CustomCommandInput
                  placeholder="Search advertiser..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CustomCommandList>
                  <CustomCommandEmpty>No advertisers found.</CustomCommandEmpty>
                  <CustomCommandGroup>
                    {filteredAdvertiserOptions.map((advertiser) => (
                      <CustomCommandItem
                        key={advertiser.value}
                        value={advertiser.value}
                        onSelect={(currentValue) => {
                          setSelectedAdvertiser(
                            currentValue === selectedAdvertiser
                              ? ""
                              : currentValue
                          );
                          setOpenCombobox(false);
                          setSearchTerm(""); // Reset search term on selection
                        }}
                        selected={selectedAdvertiser === advertiser.value}
                      >
                        {advertiser.label}
                      </CustomCommandItem>
                    ))}
                  </CustomCommandGroup>
                </CustomCommandList>
              </CustomCommand>
            </PopoverContent>
          </Popover>
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
              <TableHead>Advertiser</TableHead>
              <TableHead>Sector</TableHead>
              {data.stations.map((station) => (
                <TableHead key={station}>{station}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((ad, index) => (
              <TableRow key={index}>
                <TableCell>{ad.advertiser}</TableCell>
                <TableCell>{ad.sector}</TableCell>
                {data.stations.map((station) => {
                  const stationData = ad.stations.find(
                    (s) => s.station === station
                  );
                  return (
                    <TableCell key={station}>
                      {showAirtime
                        ? stationData?.airtime || 0
                        : stationData?.adCount || 0}
                      {showAirtime ? " sec" : ""}
                    </TableCell>
                  );
                })}
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

export default TopAdComparisonTable;
