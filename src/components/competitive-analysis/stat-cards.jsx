"use client";

import React from "react";
import StatCard from "../card/stat-card";

const StatCards = ({ data }) => {
  // Sort cards by values in descending order
  const sortedCards = data.map((card) => {
    // Create an array of key-value pairs
    const pairs = card.keys.map((key, index) => ({
      key,
      value: parseInt(card.values[index], 10), // Convert string to number
    }));

    // Sort pairs by value in descending order
    pairs.sort((a, b) => b.value - a.value);

    // Extract sorted keys and values
    return {
      ...card,
      keys: pairs.map((pair) => pair.key),
      values: pairs.map((pair) => pair.value.toString()), // Convert back to string for consistency
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {sortedCards.map((card, index) => (
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
