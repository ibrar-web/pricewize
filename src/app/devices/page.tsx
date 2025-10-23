"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/SearchBar";
import { DeviceCard } from "@/components/ui/DeviceCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { BrandFilter } from "@/components/brand/BrandFilter";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface Device {
  _id: string;
  name: string;
  brand: string;
  modelSlug: string;
  category: string;
  image?: string;
  lowestPrice?: number;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchDevices();
  }, [selectedBrand, selectedCategory]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (selectedBrand) params.append("brand", selectedBrand);
      if (selectedCategory) params.append("category", selectedCategory);

      const response = await fetch(`/api/devices?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data = await response.json();
      setDevices(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearching(!!query);
  };

  const displayDevices = searching
    ? devices.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : devices;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Browse Devices</h1>
            </div>
            <p className="text-gray-600">
              {searching
                ? "Search results"
                : `${devices.length} device${devices.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
        </div>

        {/* Search Bar and Filters */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <SearchBar onSearch={handleSearch} placeholder="Search for a device..." />
            <BrandFilter
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              onBrandChange={setSelectedBrand}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {loading ? (
            <SkeletonGrid count={6} />
          ) : displayDevices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-12 text-center"
            >
              <p className="text-gray-600 text-lg mb-4">
                {searching ? "No devices found matching your search" : "No devices available yet"}
              </p>
              {searching && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearching(false);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayDevices.map((device, index) => (
                <DeviceCard
                  key={device._id}
                  id={device._id}
                  name={device.name}
                  brand={device.brand}
                  slug={device.modelSlug}
                  category={device.category}
                  image={device.image}
                  lowestPrice={device.lowestPrice}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

