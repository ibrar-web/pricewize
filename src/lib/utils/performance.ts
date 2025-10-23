/**
 * Performance Optimization Utilities
 * Includes caching, compression, and optimization strategies
 */

// Cache configuration
export const CACHE_CONFIG = {
  // Device data - cache for 1 hour
  DEVICE_CACHE_TIME: 60 * 60,

  // Price data - cache for 30 minutes
  PRICE_CACHE_TIME: 30 * 60,

  // Search results - cache for 5 minutes
  SEARCH_CACHE_TIME: 5 * 60,

  // Analytics - cache for 1 hour
  ANALYTICS_CACHE_TIME: 60 * 60,
};

// Response headers for performance
export const PERFORMANCE_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Image optimization config
export const IMAGE_CONFIG = {
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
  },
  formats: ["webp", "jpeg"],
  quality: 80,
};

// Database query optimization
export const DB_QUERY_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PAGINATION_SIZE: 20,
};

// API rate limiting
export const RATE_LIMIT_CONFIG = {
  // 100 requests per minute per IP
  REQUESTS_PER_MINUTE: 100,

  // 1000 requests per hour per IP
  REQUESTS_PER_HOUR: 1000,

  // 10000 requests per day per IP
  REQUESTS_PER_DAY: 10000,
};

/**
 * Generate cache key for database queries
 */
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("|");

  return `${prefix}:${sortedParams}`;
}

/**
 * Calculate cache expiration time
 */
export function getCacheExpiration(cacheTime: number): Date {
  return new Date(Date.now() + cacheTime * 1000);
}

/**
 * Optimize database query with pagination
 */
export function getPaginationParams(page: number = 1, limit: number = 20) {
  const validLimit = Math.min(limit, DB_QUERY_LIMITS.MAX_LIMIT);
  const skip = (page - 1) * validLimit;

  return { skip, limit: validLimit };
}

/**
 * Generate ETag for cache validation
 */
export function generateETag(data: any): string {
  const hash = require("crypto")
    .createHash("md5")
    .update(JSON.stringify(data))
    .digest("hex");

  return `"${hash}"`;
}

/**
 * Compress response data
 */
export function shouldCompress(size: number): boolean {
  // Compress if larger than 1KB
  return size > 1024;
}

/**
 * Get optimal image size for device
 */
export function getOptimalImageSize(deviceWidth: number): number {
  if (deviceWidth < 640) return IMAGE_CONFIG.sizes.small;
  if (deviceWidth < 1024) return IMAGE_CONFIG.sizes.medium;
  return IMAGE_CONFIG.sizes.large;
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private startTime: number;
  private marks: Map<string, number>;

  constructor() {
    this.startTime = Date.now();
    this.marks = new Map();
  }

  mark(name: string) {
    this.marks.set(name, Date.now());
  }

  measure(name: string, startMark: string, endMark: string): number {
    const start = this.marks.get(startMark) || this.startTime;
    const end = this.marks.get(endMark) || Date.now();
    return end - start;
  }

  getTotalTime(): number {
    return Date.now() - this.startTime;
  }

  getMetrics() {
    return {
      totalTime: this.getTotalTime(),
      marks: Object.fromEntries(this.marks),
    };
  }
}

