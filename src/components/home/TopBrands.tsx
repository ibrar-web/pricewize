"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Brand {
  brand: string;
  totalDevices: number;
  categories: string[];
}

export function TopBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brands");

        const data = await response.json();
        // Get top 12 brands
        setBrands(data.data.slice(0, 12));
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (error || loading) {
    return null;
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 mb-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Popular Brands
          </h3>
        </div>

        {/* Compact Brands List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.brand}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/brand/${brand.brand.toLowerCase()}`}>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer hover:shadow-md">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {brand.brand}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {brand.totalDevices} device{brand.totalDevices !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

