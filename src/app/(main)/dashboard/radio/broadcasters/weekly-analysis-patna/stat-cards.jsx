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
  const [selectedWeek, setSelectedWeek] = useState("week_19");

// Data for Week 1
const week19Data = {
  topAdvertisersByCount: [
    { name: "GOLDIEE", value: 872 },
    { name: "GROWMED", value: 813 },
    { name: "GOAL INSTITUTE", value: 771 },
    { name: "CANARA BANK", value: 670 },
  ],
  topAdvertisersBySeconds: [
    { name: "GOAL INSTITUTE", value: 15809 },
    { name: "MARUTI SUZUKI", value: 9910 },
    { name: "ACHARYA MANISH JI", value: 9628 },
    { name: "SBI", value: 9475 },
  ],
  topStationsByCount: [
    { name: "Radio_City", value: 7595 },
    { name: "Big_fm", value: 5719 },
    { name: "Radio_Mirchi", value: 4219 },
    { name: "Red_FM", value: 3410 },
  ],
  topStationsBySeconds: [
    { name: "Radio_City", value: 95458 },
    { name: "Radio_Mirchi", value: 83479 },
    { name: "Big_fm", value: 75599 },
    { name: "Red_FM", value: 63773 },
  ],
};

// Data for Week 2
const week20Data = {
  topAdvertisersByCount: [
    { name: "GROWMED", value: 853 },
    { name: "GOLDIEE", value: 845 },
    { name: "GOAL INSTITUTE", value: 802 },
    { name: "CANARA BANK", value: 729 },
  ],
  topAdvertisersBySeconds: [
    { name: "GOAL INSTITUTE", value: 16443 },
    { name: "MARUTI SUZUKI", value: 12041 },
    { name: "DABUR", value: 11883 },
    { name: "VI", value: 9570 },
  ],
  topStationsByCount: [
    { name: "Radio_City", value: 7363 },
    { name: "Radio_Mirchi", value: 5218 },
    { name: "Red_FM", value: 4396 },
    { name: "Big_fm", value: 5686 },
  ],
  topStationsBySeconds: [
    { name: "Radio_Mirchi", value: 107670 },
    { name: "Radio_City", value: 96098 },
    { name: "Red_FM", value: 80879 },
    { name: "Big_fm", value: 75158 },
  ],
};


  // Select data based on the current week
  const currentData = selectedWeek === "week_19" ? week19Data : week20Data;

  const sections = [
    {
      title: "Top Advertisers by Ad Count",
      data: currentData.topAdvertisersByCount,
      description: "Advertisers with the highest number of ad plays",
      icon: <ScrollText className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      // trend: selectedWeek === "week_19" ? "+2.1%" : "+2.5%",
      isPositive: true,
    },
    {
      title: "Top Advertisers by Airtime",
      data: currentData.topAdvertisersBySeconds,
      description: "Advertisers with the most accumulated ad seconds",
      icon: <BarChart className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      // trend: selectedWeek === "week_19" ? "+1.5%" : "-0.8%",
      isPositive: selectedWeek === "week_19",
    },
    {
      title: "Top Stations by Ad Count",
      data: currentData.topStationsByCount,
      description: "Radio stations with the highest number of ad plays",
      icon: <CheckSquare className="text-gray-600" size={20} />,
      formatValue: (value) => `${value} plays`,
      // trend: selectedWeek === "week_19" ? "+1.8%" : "+2.3%",
      isPositive: true,
    },
    {
      title: "Top Stations by Airtime",
      data: currentData.topStationsBySeconds,
      description: "Radio stations with the most accumulated ad seconds",
      icon: <Users className="text-gray-600" size={20} />,
      formatValue: (value) => `${Math.round(value / 60)} mins`,
      // trend: selectedWeek === "week_19" ? "+1.2%" : "-0.5%",
      isPositive: selectedWeek === "week_19",
    },
  ];

  const weeks = [
    { value: "week_19", label: "Week 19 (May 07-13, 2025)" },
    { value: "week_20", label: "Week 20 (May 14-20, 2025)" },
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