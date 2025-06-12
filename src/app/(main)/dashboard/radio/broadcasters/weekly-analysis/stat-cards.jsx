"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckSquare, ScrollText, Users, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatCards = () => {
  const [selectedWeek, setSelectedWeek] = useState("week_16");

  // Data for Week 16 (April 14-20, 2025)
  const week16Data = {
    topAdvertisersByCount: [
      { name: "Ajmal Bismi", value: 1200 },
      { name: "Govt. of Kerala", value: 843 },
      { name: "Euro Gaurd", value: 593 },
      { name: "Malabar Golds & Diamonds", value: 455 },
    ],
    topAdvertisersBySeconds: [
      { name: "Govt. of Kerala", value: 21148 },
      { name: "Ajmal Bismi", value: 17851 },
      { name: "Info & Public Relations Dept.", value: 11601 },
      { name: "Malabar Golds & Diamonds", value: 11218 },
    ],
    topStationsByCount: [
      { name: "Red FM", value: 5666 },
      { name: "Club FM", value: 2300 },
      { name: "Mango", value: 2152 },
      { name: "Mirchi", value: 1523 },
    ],
    topStationsBySeconds: [
      { name: "Red FM", value: 74254 },
      { name: "Club FM", value: 48240 },
      { name: "Mango", value: 45678 },
      { name: "Mirchi", value: 27525 },
    ],
  };

  // Data for Week 17 (April 21-27, 2025)
  const week17Data = {
    topAdvertisersByCount: [
      { name: "MYG Future", value: 677 },
      { name: "Euro Guard", value: 710 },
      { name: "Anaswara Jewellers", value: 628 },
      { name: "Nakshatra Gold & Diamonds", value: 534 },
    ],
    topAdvertisersBySeconds: [
      { name: "Malabar Gold & Diamonds", value: 13350 }, // Converted to seconds
      { name: "Govt. of Kerala", value: 16985 },
      { name: "MYG Future", value: 10155 },
      { name: "Image Mobiles & Computers", value: 9960 },
    ],
    topStationsByCount: [
      { name: "Club FM", value: 2335 },
      { name: "Mango", value: 2417 },
      { name: "Mirchi", value: 1258 },
      { name: "Red FM", value: 6424 },
    ],
    topStationsBySeconds: [
      { name: "Club FM", value: 49600 },
      { name: "Mango", value: 46424 },
      { name: "Mirchi", value: 19693 },
      { name: "Red FM", value: 80425 },
    ],
  };

  // Select data based on the current week
  const currentData = selectedWeek === "week_16" ? week16Data : week17Data;

  const sections = [
    {
      title: "Top Advertisers by Ad Count",
      data: currentData.topAdvertisersByCount,
      description: "Advertisers with the highest number of ad plays",
      icon: <ScrollText className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      // trend: selectedWeek === "week_16" ? "+2.1%" : "+2.5%",
      isPositive: true,
    },
    {
      title: "Top Advertisers by Airtime",
      data: currentData.topAdvertisersBySeconds,
      description: "Advertisers with the most accumulated ad seconds",
      icon: <BarChart className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      // trend: selectedWeek === "week_16" ? "+1.5%" : "-0.8%",
      isPositive: selectedWeek === "week_16",
    },
    {
      title: "Top Stations by Ad Count",
      data: currentData.topStationsByCount,
      description: "Radio stations with the highest number of ad plays",
      icon: <CheckSquare className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      // trend: selectedWeek === "week_16" ? "+1.8%" : "+2.3%",
      isPositive: true,
    },
    {
      title: "Top Stations by Airtime",
      data: currentData.topStationsBySeconds,
      description: "Radio stations with the most accumulated ad seconds",
      icon: <Users className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      // trend: selectedWeek === "week_16" ? "+1.2%" : "-0.5%",
      isPositive: selectedWeek === "week_16",
    },
  ];

  const weeks = [
    { value: "week_16", label: "Week 16 (Apr 14-20, 2025)" },
    { value: "week_17", label: "Week 17 (Apr 21-27, 2025)" },
  ];

  const renderTrend = (trend, isPositive) => {
    if (!trend) return null;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
      <div className={`flex items-center text-xs ${color}`}>
        <Icon size={12} className="mr-1" />
        <span>{trend}</span>
        <span className="text-gray-400 text-xs ml-1">vs last month</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Week Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Ad Performance Rankings</h2>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-56 bg-white shadow-sm border-gray-200">
            <SelectValue placeholder="Select Week" />
          </SelectTrigger>
          <SelectContent>
            {weeks.map((week) => (
              <SelectItem key={week.value} value={week.value}>
                {week.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <Card
            key={index}
            className="rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <CardHeader className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {section.title}
                </CardTitle>
                <div className="p-1.5 bg-gray-100 rounded-md">{section.icon}</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{section.description}</p>
              {renderTrend(section.trend, section.isPositive)}
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {section.data.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{idx + 1}. {item.name}</span>
                    <span className="font-medium text-gray-800">
                      {section.formatValue(item.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatCards;