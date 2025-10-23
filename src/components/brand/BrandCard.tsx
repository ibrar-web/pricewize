"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface BrandCardProps {
  brand: string;
  totalDevices: number;
  categories: string[];
}

export function BrandCard({ brand, totalDevices, categories }: BrandCardProps) {
  return (
    <Link href={`/brand/${brand.toLowerCase()}`}>
      <motion.div
        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500">
          {/* Brand Name */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {brand}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {totalDevices} device{totalDevices !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="text-xs capitalize"
              >
                {category}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 3} more
              </Badge>
            )}
          </div>

          {/* CTA */}
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700">
            Browse →
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

