"use client";

import { TrendingDown, TrendingUp, Package, Zap } from "lucide-react";

interface PlatformStats {
  platform: string;
  totalListings: number;
  newListings: number;
  usedListings: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  listings: any[];
}

interface PlatformComparisonProps {
  platformStats: PlatformStats[];
  overallLowest: number;
  overallHighest: number;
}

export function PlatformComparison({
  platformStats,
  overallLowest,
  overallHighest,
}: PlatformComparisonProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "olx":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          badge: "bg-blue-100 text-blue-800",
          icon: "text-blue-600",
        };
      case "priceoye":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          badge: "bg-purple-100 text-purple-800",
          icon: "text-purple-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-800",
          icon: "text-gray-600",
        };
    }
  };

  const getPricePercentage = (price: number) => {
    const range = overallHighest - overallLowest;
    if (range === 0) return 0;
    return ((price - overallLowest) / range) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformStats.map((stat) => {
          const colors = getPlatformColor(stat.platform);
          const isBestPrice = stat.lowestPrice === overallLowest;

          return (
            <div
              key={stat.platform}
              className={`${colors.bg} border ${colors.border} rounded-lg p-6 hover:shadow-lg transition-shadow`}
            >
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                  {stat.platform}
                </span>
                {isBestPrice && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    Best Price
                  </span>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-gray-600">Price Range</span>
                  <span className="text-2xl font-bold text-gray-900">
                    PKR {stat.lowestPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  to PKR {stat.highestPrice.toLocaleString()}
                </p>
              </div>

              {/* Average Price */}
              <div className="mb-4 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Average Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  PKR {stat.averagePrice.toLocaleString()}
                </p>
              </div>

              {/* Listings Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className={`w-4 h-4 ${colors.icon}`} />
                    <span className="text-xs text-gray-600">New</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.newListings}
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className={`w-4 h-4 ${colors.icon}`} />
                    <span className="text-xs text-gray-600">Used</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.usedListings}
                  </p>
                </div>
              </div>

              {/* Total Listings */}
              <div className="text-center pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {stat.totalListings}
                  </span>{" "}
                  total listings
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Price Comparison
        </h3>
        <div className="space-y-4">
          {platformStats.map((stat) => {
            const colors = getPlatformColor(stat.platform);
            const percentage = getPricePercentage(stat.lowestPrice);

            return (
              <div key={stat.platform}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {stat.platform}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    PKR {stat.lowestPrice.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${colors.badge.split(" ")[0]}`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

