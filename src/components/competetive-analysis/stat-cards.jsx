"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import StatCard from "../card/stat-card";


const StatCards = ({ data }) => {
  // Default to first week
  const [selectedWeek, setSelectedWeek] = useState(data[0].week);

  const currentWeekData = data.find((w) => w.week === selectedWeek);

  return (
    <div className="space-y-4">
 <div className="flex items-center justify-end gap-2">
          {/* <Label htmlFor="week">Select Week:</Label> */}
          <Select
            value={selectedWeek}
            onValueChange={(value) => setSelectedWeek(value)}
          >
            <SelectTrigger className="w-[180px]" id="week">
              <SelectValue placeholder="Select a week" />
            </SelectTrigger>
            <SelectContent>
              {data.map((week) => (
                <SelectItem key={week.week} value={week.week}>
                  {week.week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {currentWeekData?.cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            desc={card.desc}
            keys={card.keys}
            values={card.values}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCards;
