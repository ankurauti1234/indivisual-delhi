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
  const [selectedWeek, setSelectedWeek] = useState("week_1");

 // Data for Week 25 (June 16-22, 2025)
const week1Data = {
  topAdvertisersByCount: [
    { name: "GYGY GROUP", value: 1002 },
    { name: "BHUTANI GROUP", value: 527 },
    { name: "ETERNIA BY GREAT VALUE REALTY", value: 334 },
    { name: "RAMA KRISHNA JEWELLERS", value: 300 },
  ],
  topAdvertisersBySeconds: [
    { name: "GYGY GROUP", value: 18470.0 },
    { name: "ETERNIA BY GREAT VALUE REALTY", value: 8111.0 },
    { name: "BHUTANI GROUP", value: 5849.0 },
    { name: "BHUTANI CITY CENTER BHUTANI KIDS CARNIVAL", value: 5734.0 },
  ],
  topStationsByCount: [
    { name: "Fever_FM", value: 5343 },
  ],
  topStationsBySeconds: [
    { name: "Fever_FM", value: 110129.0 },
  ],
};

  // Select data (only one week available)
  const currentData = week1Data;

  const sections = [
    {
      title: "Top Advertisers by Ad Count",
      data: currentData.topAdvertisersByCount,
      description: "Advertisers with the highest number of ad plays",
      icon: <ScrollText className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      isPositive: true,
    },
    {
      title: "Top Advertisers by Airtime",
      data: currentData.topAdvertisersBySeconds,
      description: "Advertisers with the most accumulated ad seconds",
      icon: <BarChart className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      isPositive: true,
    },
    {
      title: "Top Stations by Ad Count",
      data: currentData.topStationsByCount,
      description: "Radio stations with the highest number of ad plays",
      icon: <CheckSquare className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      isPositive: true,
    },
    {
      title: "Top Stations by Airtime",
      data: currentData.topStationsBySeconds,
      description: "Radio stations with the most accumulated ad seconds",
      icon: <Users className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      isPositive: true,
    },
  ];

  const weeks = [
    { value: "week_1", label: "Week 25 (June 16-22, 2025)" },
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