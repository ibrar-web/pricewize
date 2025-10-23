"use client";

import { motion } from "framer-motion";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Price {
  platform: string;
  price: number;
  formattedPrice: string;
  condition: string;
  location: string;
  url?: string;
}

interface CompareCardProps {
  device: {
    id: string;
    name: string;
    brand: string;
    modelSlug: string;
    category: string;
    image?: string;
  };
  prices: Price[];
  statistics: {
    lowestPrice: string;
    highestPrice: string;
    averagePrice: string;
    totalListings: number;
  };
  onRemove: (deviceId: string) => void;
  index: number;
}

export function CompareCard({
  device,
  prices,
  statistics,
  onRemove,
  index,
}: CompareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header with Image and Remove Button */}
      <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 p-6">
        <button
          onClick={() => onRemove(device.id)}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
          title="Remove from comparison"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Device Image */}
        <div className="flex justify-center mb-4">
          {device.image ? (
            <img
              src={device.image}
              alt={device.name}
              className="h-48 w-auto object-contain rounded-lg"
            />
          ) : (
            <div className="h-48 w-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Device Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
          <p className="text-gray-600 text-sm">{device.brand}</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Price Statistics
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-gray-600 text-sm">Lowest Price</span>
            <span className="font-bold text-green-600">{statistics.lowestPrice}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-gray-600 text-sm">Average Price</span>
            <span className="font-bold text-blue-600">{statistics.averagePrice}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-gray-600 text-sm">Highest Price</span>
            <span className="font-bold text-red-600">{statistics.highestPrice}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 text-sm">Total Listings</span>
            <span className="font-bold text-gray-900">{statistics.totalListings}</span>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Available Listings ({prices.length})
        </h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {prices.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No listings available</p>
          ) : (
            prices.map((price, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {price.platform}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Condition: <span className="font-medium">{price.condition}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Location: <span className="font-medium">{price.location}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {price.formattedPrice}
                    </p>
                  </div>
                </div>

                {/* View Link Button */}
                {price.url && (
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 px-2 py-1 hover:bg-blue-100 rounded transition-colors"
                  >
                    View Listing
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* View Details Link */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <Link
          href={`/devices/${device.modelSlug}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          View Full Details
        </Link>
      </div>
    </motion.div>
  );
}

