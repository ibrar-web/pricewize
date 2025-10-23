"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DeviceCard } from "@/components/ui/DeviceCard";
import { BrandFilter } from "@/components/brand/BrandFilter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface Device {
  _id: string;
  name: string;
  brand: string;
  modelSlug: string;
  category: string;
  image?: string;
  lowestPrice?: number;
}

interface BrandPageContentProps {
  brand: string;
  deviceCount: number;
  categories: string[];
}

export function BrandPageContent({
  brand,
  deviceCount,
  categories,
}: BrandPageContentProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const params = new URLSearchParams({
          brand,
          limit: "50",
          page: page.toString(),
        });

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/devices?${params}`);
        if (!response.ok) throw new Error("Failed to fetch devices");

        const data = await response.json();
        setDevices(data.data || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      }
    };

    fetchDevices();
  }, [brand, selectedCategory, page]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {brand} Devices
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {deviceCount} device{deviceCount !== 1 ? "s" : ""} available
          </p>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="capitalize">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <BrandFilter
            selectedBrand={brand}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>

        {/* Devices Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {devices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device, index) => (
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
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No devices found for {brand}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

