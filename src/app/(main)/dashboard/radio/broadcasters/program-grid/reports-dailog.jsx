'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed date-fns dependency - using native JS date formatting
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReportsDialog = ({ selectedDate }) => {
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [region, setRegion] = useState("");
  const [station, setStation] = useState("");
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // Removed noReportAlert state as it's not needed
  const { toast } = useToast();

  // Available regions and stations
  const regions = ["Kochi"];
  const stations = ["Radio Mirchi", "Club FM", "Mango FM", "Red FM"];

  // Removed availability check as it causes issues with button being disabled

  // No longer checking report availability to avoid button being disabled

  const handleDownload = async () => {
    if (!region || !station || !date) {
      toast({
        title: "Selection Required",
        description: "Please select region, station, and date.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const fileName = `${station}_${formattedDate}_report.csv`;
      const fileUrl = `https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/${region}/${encodeURIComponent(station)}/${formattedDate}/report.csv`;

      // Fetch the report file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("No reports available for this date");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: `Report for ${station} on ${formattedDate} downloaded successfully.`,
      });

      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message || "An error occurred while downloading the report.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md shadow-sm flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-0">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Download Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Region Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Station Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Station</Label>
              <Select value={station} onValueChange={setStation}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 rounded-b-xl">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !region || !station || !date}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;