export interface DeviceListing {
  _id?: string;
  model: string;
  price: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  location: string;
  platform: "OLX" | "Cashify" | "eBay" | "Other";
  url: string;
  sellerName?: string;
  description?: string;
  images?: string[];
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NormalizedDevice {
  model: string;
  price: number;
  condition: string;
  location: string;
  platform: string;
  url: string;
  sellerName?: string;
  description?: string;
}

export interface DeviceComparison {
  model: string;
  listings: DeviceListing[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  totalListings: number;
}

export interface ScraperResult {
  platform: string;
  itemsScraped: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

