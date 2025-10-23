"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

interface DeviceFilterProps {
  onFilterChange: (filters: FilterState) => void;
  locations?: string[];
}

export interface FilterState {
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedLocation: string;
}

export function DeviceFilter({ onFilterChange, locations = [] }: DeviceFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: 0,
    maxPrice: 500000,
    selectedLocation: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFilters({ ...filters, minPrice: value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 500000;
    setFilters({ ...filters, maxPrice: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, selectedLocation: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      minPrice: 0,
      maxPrice: 500000,
      selectedLocation: "",
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500000 ||
    filters.selectedLocation;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search devices by name or brand..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
      >
        <Filter size={18} />
        {showFilters ? "Hide Filters" : "Show Filters"}
        {hasActiveFilters && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200"
        >
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Min: ₨{filters.minPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.minPrice}
                  onChange={handleMinPriceChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Max: ₨{filters.maxPrice.toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.maxPrice}
                  onChange={handleMaxPriceChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Location
            </label>
            <select
              value={filters.selectedLocation}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <X size={18} />
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

