"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const regions = ["delhi", "agra", "madurai", "patna"];

export default function RegionSelect({
  region,
  setRegion,
}) {
  return (
    <div className="mb-4">
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
