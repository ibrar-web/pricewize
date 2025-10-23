"use client";

import { useEffect, useState } from "react";
import { BrandCard } from "@/components/brand/BrandCard";
import { BrandGridSkeleton } from "@/components/brand/BrandSkeleton";

interface Brand {
  brand: string;
  totalDevices: number;
  categories: string[];
}

export function TopBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brands");

        const data = await response.json();
        // Get top 8 brands
        setBrands(data.data.slice(0, 8));
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands");
      }
    };

    fetchBrands();
  }, []);

  if (error) {
    return null; // Silently fail - don't break the page
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Top Brands
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Browse devices from the world's leading manufacturers
          </p>
        </div>

        {/* Brands Grid */}
        {!mounted || brands.length === 0 ? (
          <BrandGridSkeleton count={8} />
        ) : brands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <BrandCard
                key={brand.brand}
                brand={brand.brand}
                totalDevices={brand.totalDevices}
                categories={brand.categories}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No brands available yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

