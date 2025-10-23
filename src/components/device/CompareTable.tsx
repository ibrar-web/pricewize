"use client";

import { DeviceComparison } from "@/types/device";
import { TrendingDown, TrendingUp } from "lucide-react";

interface CompareTableProps {
  comparison: DeviceComparison;
}

export function CompareTable({ comparison }: CompareTableProps) {
  const savingsPercentage = (
    ((comparison.highestPrice - comparison.lowestPrice) /
      comparison.highestPrice) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Lowest Price</p>
          <p className="text-2xl font-bold text-green-900">
            ₹{comparison.lowestPrice.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
            <TrendingDown size={16} />
            Best Deal
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">Highest Price</p>
          <p className="text-2xl font-bold text-red-900">
            ₹{comparison.highestPrice.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
            <TrendingUp size={16} />
            Premium
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Average Price</p>
          <p className="text-2xl font-bold text-blue-900">
            ₹{comparison.averagePrice.toLocaleString()}
          </p>
          <p className="text-blue-600 text-sm mt-1">Market Average</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Potential Savings</p>
          <p className="text-2xl font-bold text-purple-900">{savingsPercentage}%</p>
          <p className="text-purple-600 text-sm mt-1">vs Highest Price</p>
        </div>
      </div>

      {/* Listings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Platform
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Brand
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Price
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Condition
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Location
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Seller
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.listings.map((listing, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-semibold text-gray-900">
                    {listing.platform}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {listing.brand ? (
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {listing.brand}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-lg text-gray-900">
                    ₨{listing.price.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {listing.condition}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{listing.location}</td>
                <td className="py-3 px-4 text-gray-600">
                  {listing.sellerName || "N/A"}
                </td>
                <td className="py-3 px-4">
                  {listing.url && (
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Listings */}
      <div className="text-center text-sm text-gray-600">
        Showing {comparison.totalListings} listings for {comparison.model}
      </div>
    </div>
  );
}

