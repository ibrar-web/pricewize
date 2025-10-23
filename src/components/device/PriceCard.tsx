"use client";

import { DeviceListing } from "@/types/device";
import { ExternalLink, MapPin, User } from "lucide-react";

interface PriceCardProps {
  listing: DeviceListing;
}

export function PriceCard({ listing }: PriceCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "OLX":
        return "bg-orange-50 border-orange-200";
      case "Cashify":
        return "bg-purple-50 border-purple-200";
      case "eBay":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${getPlatformColor(
        listing.platform
      )}`}
    >
      {/* Image */}
      {listing.images && listing.images.length > 0 ? (
        <img
          src={listing.images[0]}
          alt={listing.platform}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{listing.platform}</h3>
            <p className="text-sm text-gray-600">{listing.sellerName || "Unknown Seller"}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(listing.condition)}`}>
            {listing.condition}
          </span>
        </div>

        {/* Brand */}
        {listing.brand && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {listing.brand}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900">
            ₨{listing.price.toLocaleString()}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{listing.location}</span>
          </div>
          {listing.description && (
            <p className="text-gray-600 line-clamp-2">{listing.description}</p>
          )}
        </div>

        {/* Link */}
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View on {listing.platform}
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

