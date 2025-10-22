"use client";

import { useState, useCallback, useEffect } from "react";

export interface SearchResult {
  success: boolean;
  status: "found" | "not_found" | "found_no_prices" | "loading" | "error";
  message: string;
  data: {
    device: {
      id: string;
      name: string;
      brand: string;
      modelSlug: string;
      category: string;
      image?: string;
      description?: string;
      lastUpdated: string;
    };
    prices: Array<{
      id: string;
      platform: string;
      price: number;
      formattedPrice: string;
      condition: string;
      location: string;
      sellerName?: string;
      url: string;
      description?: string;
      images?: string[];
      lastScraped: string;
    }>;
    statistics: {
      lowestPrice: string;
      highestPrice: string;
      averagePrice: string;
      medianPrice: string;
      totalListings: number;
      pricesByPlatform: Array<{
        platform: string;
        count: number;
        lowestPrice: string;
        averagePrice: string;
      }>;
    };
  } | null;
}

export interface UseSearchDeviceReturn {
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

/**
 * Custom hook for searching devices with auto-scraper trigger
 * Handles debouncing, loading states, and error handling
 */
export function useSearchDevice(): UseSearchDeviceReturn {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const search = useCallback(
    async (query: string) => {
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Validate query
      if (!query || query.trim().length === 0) {
        setResults(null);
        setError(null);
        return;
      }

      if (query.length < 2) {
        setError("Search query must be at least 2 characters");
        return;
      }

      // Set loading state
      setLoading(true);
      setError(null);

      // Debounce search
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/devices/search?q=${encodeURIComponent(query)}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Search failed");
          }

          const data: SearchResult = await response.json();
          setResults(data);

          if (!data.success) {
            setError(data.message);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
          setError(errorMessage);
          setResults(null);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce

      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}

