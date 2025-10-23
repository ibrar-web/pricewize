"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ModelSearch } from "@/components/device/ModelSearch";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { TrendingCarousel } from "@/components/ui/TrendingCarousel";
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

interface HomeContentProps {
  initialTrendingDevices?: TrendingDevice[];
}

export function HomeContent({ initialTrendingDevices = [] }: HomeContentProps) {
  const trendingDevices = initialTrendingDevices;

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Find the Smartest Deals on Used Devices
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
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
          className="flex justify-center mb-16"
        >
          <ModelSearch />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
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

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Trending Now
          </h2>
          <TrendingCarousel devices={trendingDevices} />
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Start Comparing Prices Today
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-blue-100 mb-8 max-w-2xl mx-auto"
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

