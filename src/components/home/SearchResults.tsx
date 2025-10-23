"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, X } from "lucide-react";
import Link from "next/link";

interface Device {
  _id: string;
  name: string;
  brand: string;
  modelSlug: string;
  image?: string;
  lowestPrice?: number;
}

interface Price {
  _id: string;
  deviceId: string;
  platform: string;
  price: number;
  condition: string;
  location: string;
  sellerName: string;
  url: string;
  images: string[];
}

interface SearchResultsProps {
  query: string;
  onClose?: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setDevices([]);
      setPrices([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Search devices by name or brand
        const deviceRes = await fetch(
          `/api/devices?search=${encodeURIComponent(query)}&limit=50`
        );
        if (deviceRes.ok) {
          const data = await deviceRes.json();
          setDevices(data.data || []);

          // Get all prices for these devices
          if (data.data && data.data.length > 0) {
            const deviceIds = data.data.map((d: Device) => d._id);
            const priceRes = await fetch(
              `/api/prices?deviceIds=${deviceIds.join(",")}`
            );
            if (priceRes.ok) {
              const priceData = await priceRes.json();
              setPrices(priceData.data || []);

              // Extract unique locations
              const uniqueLocations = [
                ...new Set((priceData.data || []).map((p: Price) => p.location)),
              ] as string[];
              setLocations(uniqueLocations);
            }
          }
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Filter prices based on criteria
  const filteredPrices = prices.filter((price) => {
    const priceMatch = price.price >= minPrice && price.price <= maxPrice;
    const locationMatch =
      !selectedLocation || price.location === selectedLocation;
    return priceMatch && locationMatch;
  });

  if (!query.trim()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-4 bg-white rounded-lg shadow-2xl z-20 max-h-[600px] overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results for "{query}"
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Searching...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No listings found matching your criteria</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{filteredPrices.length} listings</p>
                    <p className="text-xs">from {devices.length} devices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrices.slice(0, 6).map((price, idx) => {
                const device = devices.find((d) => d._id === price.deviceId);
                return (
                  <motion.div
                    key={price._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link
                      href={`/device/${device?.modelSlug || price.deviceId}`}
                      className="block"
                    >
                      {/* Image */}
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        {price.images?.[0] ? (
                          <img
                            src={price.images[0]}
                            alt={device?.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {price.platform}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                          {device?.name}
                        </h4>

                        {/* Price */}
                        <div className="mb-3">
                          <p className="text-lg font-bold text-green-600">
                            Rs {price.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Condition: {price.condition}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-xs text-gray-600 mb-3">
                          <MapPin size={14} className="mr-1" />
                          {price.location}
                        </div>

                        {/* Seller */}
                        <p className="text-xs text-gray-600 mb-3">
                          Seller: {price.sellerName}
                        </p>

                        {/* View Button */}
                        <a
                          href={price.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Listing
                        </a>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* View All Link */}
            {filteredPrices.length > 6 && (
              <div className="mt-6 text-center">
                <Link
                  href={`/devices?search=${encodeURIComponent(query)}`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View All {filteredPrices.length} Listings
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

