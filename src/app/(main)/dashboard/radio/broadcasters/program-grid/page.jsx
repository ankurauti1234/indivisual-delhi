"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EPG from "@/components/program-grid/EPG";

// ✅ Import region data
import { availableData as delhiData } from "@/data/delhi";
import { availableData as patnaData } from "@/data/patna";
import { availableData as agraData } from "@/data/agra";
import { availableData as maduraiData } from "@/data/madurai";
import { availableData as ajmerData } from "@/data/ajmer";
import { availableData as varanasiData } from "@/data/varanasi";
import { availableData as gorkhpurData } from "@/data/gorakhpur";
import { availableData as bikanerData } from "@/data/bikaner";
import { availableData as bareillyData } from "@/data/bareilly";
import { availableData as jalandarData } from "@/data/jalandar";
import { availableData as jamshedpurData } from "@/data/jamshedpur";
import { availableData as ranchiData } from "@/data/ranchi";
import { availableData as hisarData } from "@/data/hisar";
import { availableData as kotaData } from "@/data/kota";
import { availableData as karnalData } from "@/data/karnal";
import { availableData as patialaData } from "@/data/patiala";
import { availableData as udaipurData } from "@/data/udaipur";
import { availableData as jalgaonData } from "@/data/jalgaon";
import { availableData as sangliData } from "@/data/sangli";
import { availableData as solapurData } from "@/data/solapur";
import { availableData as kolhapurData } from "@/data/kolhapur";
import { availableData as nashikData } from "@/data/nashik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProgramGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState("delhi");
  const [key, setKey] = useState(0);

  // ✅ All region data
  const regionData = {
    delhi: delhiData,
    patna: patnaData,
    agra: agraData,
    madurai: maduraiData,
    ajmer: ajmerData,
    varanasi: varanasiData,
    gorakhpur: gorkhpurData,
    bikaner: bikanerData,
    bareilly: bareillyData,
    jalandar: jalandarData, // ✅ fixed key spelling
    jamshedpur: jamshedpurData,
    ranchi: ranchiData,
    hisar: hisarData,
    kota: kotaData,
    karnal: karnalData,
    patiala: patialaData,
    udaipur: udaipurData,
    jalgaon: jalgaonData,
    sangli: sangliData,
    solapur: solapurData,
    kolhapur: kolhapurData,
    nashik: nashikData,
  };

  // ✅ Create label/value pairs & sort alphabetically
  const regions = Object.keys(regionData)
    .map((key) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    const regionFromUrl = searchParams.get("region");
    if (regionFromUrl && regionData[regionFromUrl]) {
      setSelectedRegion(regionFromUrl);
    }
  }, [searchParams]);

  const currentData = regionData[selectedRegion];

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    setKey((prev) => prev + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("region", newRegion);
    router.push(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor="region-select"
          className="text-lg font-medium text-zinc-800 dark:text-zinc-100"
        >
          Select Region:
        </label>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <EPG key={key} region={selectedRegion} availableData={currentData} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-400"></div>
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
              Loading EPG Data...
            </p>
          </div>
        </div>
      }
    >
      <ProgramGridContent />
    </Suspense>
  );
}
