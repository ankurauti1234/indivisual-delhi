'use client'
import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import EPG from '@/components/program-grid/EPG'
import { availableData as delhiData } from "@/data/delhi";
import { availableData as patnaData } from "@/data/patna";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRegion, setSelectedRegion] = useState('delhi')
  const [key, setKey] = useState(0) // Key to force EPG re-render
  
  const regionData = {
    delhi: delhiData,
    patna: patnaData
  }
  
  // Initialize region from URL params on component mount
  useEffect(() => {
    const regionFromUrl = searchParams.get('region')
    if (regionFromUrl && (regionFromUrl === 'delhi' || regionFromUrl === 'patna')) {
      setSelectedRegion(regionFromUrl)
    }
  }, [searchParams])
  
  const currentData = regionData[selectedRegion]

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion)
    setKey(prev => prev + 1) // Force EPG component to re-render
    
    // Update URL with new region parameter
    const url = new URL(window.location.href)
    url.searchParams.set('region', newRegion)
    router.push(url.pathname + url.search, { scroll: false })
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <label htmlFor="region-select" className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
          Select Region:
        </label>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="patna">Patna</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
        <EPG key={key} region={selectedRegion} availableData={currentData} />
      </Suspense>
    </div>
  )
}

export default Page