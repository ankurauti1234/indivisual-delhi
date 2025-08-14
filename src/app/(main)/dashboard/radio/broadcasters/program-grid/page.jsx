'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EPG from '@/components/program-grid/EPG';
import { availableData as delhiData } from '@/data/delhi';
import { availableData as patnaData } from '@/data/patna';
import { availableData as agraData } from '@/data/agra';
import { availableData as maduraiData } from '@/data/madurai';
import { availableData as ajmerData } from "@/data/ajmer";
import { availableData as varanasiData } from "@/data/varanasi";
import { availableData as gorkhpurData } from "@/data/gorakhpur";
import { availableData as bikanerData } from "@/data/bikaner";
import { availableData as bareillyData } from "@/data/bareilly";
import { availableData as jalandharData } from "@/data/jalandar";
import { availableData as jamshedpurData } from "@/data/jamshedpur";
import { availableData as ranchiData } from "@/data/ranchi";
import { availableData as hisarData } from "@/data/hisar";
import { availableData as kotaData } from "@/data/kota";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ProgramGridContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState('delhi');
  const [key, setKey] = useState(0);

  const regionData = {
    delhi: delhiData,
    patna: patnaData,
    agra:agraData,
    madurai:maduraiData,
    ajmer:ajmerData,
    varanasi:varanasiData,
    gorakhpur:gorkhpurData,
    bikaner:bikanerData,
    bareilly:bareillyData,
    jalandar:jalandharData,
    jamshedpur:jamshedpurData,
    ranchi:ranchiData,
    hisar:hisarData,
    kota:kotaData
  };

  useEffect(() => {
    const regionFromUrl = searchParams.get('region');
    if (
      (regionFromUrl &&
        (regionFromUrl === "delhi"   ||
          regionFromUrl === "patna"  ||
          regionFromUrl === "agra" || regionFromUrl === "madurai"))
          
    ) {
      setSelectedRegion(regionFromUrl);
    }
  }, [searchParams]);

  const currentData = regionData[selectedRegion];

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    setKey((prev) => prev + 1);
    const url = new URL(window.location.href);
    url.searchParams.set('region', newRegion);
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
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="patna">Patna</SelectItem>
            <SelectItem value="agra">Agra</SelectItem>
            <SelectItem value="madurai">Madurai</SelectItem>
            <SelectItem value="ajmer">Ajmer</SelectItem>
            <SelectItem value="varanasi">Varanasi</SelectItem>
            <SelectItem value="gorakhpur">Gorakhpur</SelectItem>
            <SelectItem value="bikaner">Bikaner</SelectItem>
            <SelectItem value="bareilly">Bareilly</SelectItem>
            <SelectItem value="jalandar">Jalandhar</SelectItem>
            <SelectItem value="jamshedpur">Jamshedpur</SelectItem>
            <SelectItem value="ranchi">Ranchi</SelectItem>
            <SelectItem value="hisar">Hisar</SelectItem>
            <SelectItem value="kota">Kota</SelectItem>
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
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Loading EPG Data...</p>
          </div>
        </div>
      }
    >
      <ProgramGridContent />
    </Suspense>
  );
}