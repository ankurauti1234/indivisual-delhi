'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReportsDialog = ({ selectedDate }) => {
  const [date, setDate] = useState(selectedDate || format(new Date(), "yyyy-MM-dd"));
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [noReportAlert, setNoReportAlert] = useState(false);
  const { toast } = useToast();

  // Check report availability by attempting to fetch the file
  const checkReportAvailability = async (selectedDate) => {
    try {
      const formattedDate = format(new Date(selectedDate), "dd-MM-yyyy");
      const response = await fetch(`/reports/${formattedDate}.csv`, {
        method: "HEAD", // Check if file exists without downloading
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Update no-report alert whenever date changes
  useEffect(() => {
    checkReportAvailability(date).then((exists) => {
      setNoReportAlert(!exists);
    });
  }, [date]);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const formattedDate = format(new Date(date), "dd-MM-yyyy");
      const fileName = `${formattedDate}.csv`;
      const fileUrl = `/reports/${fileName}`;

      // Fetch the report file
      const response = await fetch(fileUrl);
      if (!response.ok) {
        setNoReportAlert(true);
        throw new Error("Report not found");
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
        description: `Report ${fileName} downloaded successfully.`,
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

          {noReportAlert && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg">
              <AlertDescription>No report available for the selected date.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
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
            disabled={isDownloading || noReportAlert}
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