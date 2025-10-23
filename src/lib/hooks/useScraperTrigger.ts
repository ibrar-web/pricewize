"use client";

import { useState, useCallback } from "react";

export interface ScraperResult {
  success: boolean;
  message: string;
  itemsScraped?: number;
  itemsSaved?: number;
  duration?: number;
  error?: string;
}

export interface UseScraperTriggerReturn {
  isScraperRunning: boolean;
  scraperError: string | null;
  scraperResult: ScraperResult | null;
  triggerScraper: (platform?: "OLX") => Promise<void>;
  clearResult: () => void;
}

/**
 * Custom hook for triggering scraper jobs
 * Handles scraper execution and result tracking
 */
export function useScraperTrigger(): UseScraperTriggerReturn {
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  const [scraperError, setScraperError] = useState<string | null>(null);
  const [scraperResult, setScraperResult] = useState<ScraperResult | null>(null);

  const triggerScraper = useCallback(
    async (platform: "OLX" = "OLX") => {
      setIsScraperRunning(true);
      setScraperError(null);
      setScraperResult(null);

      try {
        const response = await fetch("/api/scraper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Scraper failed");
        }

        const data: ScraperResult = await response.json();
        setScraperResult(data);

        if (!data.success) {
          setScraperError(data.error || "Scraper failed");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setScraperError(errorMessage);
      } finally {
        setIsScraperRunning(false);
      }
    },
    []
  );

  const clearResult = useCallback(() => {
    setScraperResult(null);
    setScraperError(null);
  }, []);

  return {
    isScraperRunning,
    scraperError,
    scraperResult,
    triggerScraper,
    clearResult,
  };
}

