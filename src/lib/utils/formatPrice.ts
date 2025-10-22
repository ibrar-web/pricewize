/**
 * Price Formatting Utilities
 * Handles currency formatting, price calculations, and comparisons
 */

export interface PriceStats {
  min: number;
  max: number;
  average: number;
  median: number;
  count: number;
}

/**
 * Format price to currency string (PKR)
 */
export function formatPrice(price: number, currency: string = "PKR"): string {
  const formatter = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

/**
 * Format price for display (short format)
 */
export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K`;
  }
  return price.toString();
}

/**
 * Calculate price statistics
 */
export function calculatePriceStats(prices: number[]): PriceStats {
  if (prices.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0, count: 0 };
  }

  const sorted = [...prices].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const average = sorted.reduce((a, b) => a + b, 0) / sorted.length;

  let median: number;
  if (sorted.length % 2 === 0) {
    median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  } else {
    median = sorted[Math.floor(sorted.length / 2)];
  }

  return {
    min,
    max,
    average: Math.round(average),
    median,
    count: prices.length,
  };
}

/**
 * Calculate price difference
 */
export function calculatePriceDifference(
  price1: number,
  price2: number
): { difference: number; percentage: number } {
  const difference = price1 - price2;
  const percentage = (difference / price2) * 100;

  return {
    difference,
    percentage: Math.round(percentage * 100) / 100,
  };
}

/**
 * Get price trend (up, down, stable)
 */
export function getPriceTrend(
  currentPrice: number,
  previousPrice: number
): "up" | "down" | "stable" {
  const difference = currentPrice - previousPrice;
  const percentageChange = (difference / previousPrice) * 100;

  if (percentageChange > 2) return "up";
  if (percentageChange < -2) return "down";
  return "stable";
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount * 100) / 100;
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

/**
 * Parse price string to number
 */
export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get price category
 */
export function getPriceCategory(price: number): "budget" | "mid-range" | "premium" | "luxury" {
  if (price < 20000) return "budget";
  if (price < 50000) return "mid-range";
  if (price < 100000) return "premium";
  return "luxury";
}

/**
 * Format price for API response
 */
export function formatPriceForAPI(price: number): {
  raw: number;
  formatted: string;
  short: string;
} {
  return {
    raw: price,
    formatted: formatPrice(price),
    short: formatPriceShort(price),
  };
}

