"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { DeviceCard } from "@/components/ui/DeviceCard";
import { DeviceFilter, FilterState } from "@/components/home/DeviceFilter";
import { TrendingDown, Zap, Globe, Shield } from "lucide-react";

interface TrendingDevice {
  id: string;
  name: string;
  brand: string;
  slug: string;
  image?: string;
  lowestPrice: number;
  searches: number;
}

interface Device {
  _id: string;
  name: string;
  brand: string;
  modelSlug: string;
  category: string;
  image?: string;
  lowestPrice?: number;
}

interface HomeContentProps {
  initialTrendingDevices?: TrendingDevice[];
  initialLocations?: string[];
}

export function HomeContent({
  initialTrendingDevices = [],
  initialLocations = []
}: HomeContentProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: 0,
    maxPrice: 500000,
    selectedLocation: "",
  });

  // Fetch devices on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api/devices?limit=50");
        if (response.ok) {
          const data = await response.json();
          setDevices(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // Filter devices based on filters
  useEffect(() => {
    let filtered = devices;

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          d.brand.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (d) =>
        (d.lowestPrice || 0) >= filters.minPrice &&
        (d.lowestPrice || 0) <= filters.maxPrice
    );

    setFilteredDevices(filtered);
  }, [devices, filters]);

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
          >
            Find the Smartest Deals on Used Devices
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto"
          >
            Compare prices from OLX, Cashify, eBay and more. Get the best deal
            on your next used phone, laptop, or tablet.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
        </motion.div>

        {/* Devices Section with Filters */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Browse Devices
          </h2>

          {/* Filter Component */}
          <DeviceFilter onFilterChange={setFilters} locations={locations} />

          {/* Device Cards Grid */}
          {loading ? (
            <div className="text-center py-6">
              <p className="text-gray-600">Loading devices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">
                {filters.searchQuery ||
                filters.minPrice > 0 ||
                filters.maxPrice < 500000 ||
                filters.selectedLocation
                  ? "No devices match your filters"
                  : "No devices available"}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDevices.map((device, index) => (
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
        </motion.div>
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
        >
          <FeatureCard
            icon={<TrendingDown size={24} />}
            title="Best Prices"
            description="Find the lowest prices across all platforms instantly"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            index={0}
          />

          <FeatureCard
            icon={<Globe size={24} />}
            title="Multiple Platforms"
            description="Compare listings from OLX, Cashify, eBay and more"
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            index={1}
          />

          <FeatureCard
            icon={<Zap size={24} />}
            title="Real-time Data"
            description="Prices updated daily with the latest listings"
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
            index={2}
          />

          <FeatureCard
            icon={<Shield size={24} />}
            title="Safe & Secure"
            description="Direct links to verified sellers on trusted platforms"
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            index={3}
          />
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-2"
          >
            Start Comparing Prices Today
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-blue-100 mb-4 max-w-2xl mx-auto text-sm"
          >
            Save money on your next used device purchase. Compare prices from
            multiple platforms and find the best deal.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href="/devices"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Devices
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
