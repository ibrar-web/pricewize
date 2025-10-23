"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";

interface DeviceCardProps {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category: string;
  image?: string;
  lowestPrice?: number;
  rating?: number;
  index?: number;
}

export function DeviceCard({
  id,
  name,
  brand,
  slug,
  category,
  image,
  lowestPrice,
  rating = 4.5,
  index = 0,
}: DeviceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/devices/${slug}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col cursor-pointer">
          {/* Image Container */}
          <motion.div
            className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image</p>
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {category}
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600 mb-1 font-medium">{brand}</p>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-1">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({rating})</span>
            </div>

            {/* Price */}
            {lowestPrice && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold text-blue-600"
              >
                ₨{lowestPrice.toLocaleString()}
              </motion.div>
            )}
          </div>

          {/* CTA Button */}
          <motion.div
            className="px-4 pb-4"
            whileHover={{ scale: 1.02 }}
          >
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

