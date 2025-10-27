"use client";

import { ExternalLink, MapPin, User } from "lucide-react";

export interface PriceCardProps {
  platform: string;
  price: string;
  condition: string;
  location: string;
  sellerName?: string;
  url: string;
  description?: string;
}

export function PriceCard({
  platform,
  price,
  condition,
  location,
  sellerName,
  url,
  description,
}: PriceCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "olx":
        return "bg-blue-100 text-blue-800";
      case "priceoye":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlatformColor(platform)}`}>
          {platform}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="mb-3">
        <p className="text-2xl font-bold text-gray-900">{price}</p>
        <p className={`text-sm font-medium ${getConditionColor(condition)}`}>{condition}</p>
      </div>

      <div className="space-y-2 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        {sellerName && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{sellerName}</span>
          </div>
        )}
      </div>

      {description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        View Listing
      </a>
    </div>
  );
}

