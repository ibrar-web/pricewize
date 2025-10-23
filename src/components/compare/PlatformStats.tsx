"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Package, Tag, MapPin } from "lucide-react";

interface PlatformData {
  name: string;
  url: string;
  isActive: boolean;
  lastScraped: string;
  totalListings: number;
  totalBrands: number;
  brands: string[];
  totalLocations: number;
  locations: string[];
  statistics: {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
  };
  successRate: number;
  averageResponseTime: number;
}

interface OverallStats {
  totalPlatforms: number;
  totalListings: number;
  totalBrands: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

export function PlatformStats() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/platforms/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch platform statistics");
      }

      const data = await response.json();
      setPlatforms(data.data.platforms);
      setOverall(data.data.overall);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Statistics */}
      {overall && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Market Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Platforms</p>
              <p className="text-2xl font-bold text-blue-600">{overall.totalPlatforms}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Total Listings</p>
              <p className="text-2xl font-bold text-green-600">{overall.totalListings}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Brands</p>
              <p className="text-2xl font-bold text-purple-600">{overall.totalBrands}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Lowest Price</p>
              <p className="text-2xl font-bold text-red-600">₨{overall.lowestPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Avg Price</p>
              <p className="text-2xl font-bold text-orange-600">₨{overall.averagePrice.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 font-medium">Highest Price</p>
              <p className="text-2xl font-bold text-gray-600">₨{overall.highestPrice.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Platform Cards */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <h4 className="text-lg font-bold">{platform.name}</h4>
                <p className="text-xs text-blue-100 mt-1">
                  Last scraped: {new Date(platform.lastScraped).toLocaleDateString()}
                </p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium">Listings</p>
                    <p className="text-xl font-bold text-blue-600">{platform.totalListings}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium">Brands</p>
                    <p className="text-xl font-bold text-purple-600">{platform.totalBrands}</p>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Price Range</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      Low: <span className="font-bold text-red-600">₨{platform.statistics.lowestPrice.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-700">
                      Avg: <span className="font-bold text-orange-600">₨{platform.statistics.averagePrice.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-700">
                      High: <span className="font-bold text-gray-600">₨{platform.statistics.highestPrice.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* Brands */}
                {platform.brands.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Top Brands
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platform.brands.slice(0, 5).map((brand) => (
                        <span
                          key={brand}
                          className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                      {platform.brands.length > 5 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          +{platform.brands.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {platform.locations.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Locations
                    </p>
                    <p className="text-sm text-gray-700">
                      Available in <span className="font-bold">{platform.totalLocations}</span> locations
                    </p>
                  </div>
                )}

                {/* Success Rate */}
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">Success Rate</p>
                  <p className="text-lg font-bold text-green-600">{platform.successRate}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

