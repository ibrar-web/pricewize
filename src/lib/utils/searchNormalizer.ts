/**
 * Search Normalizer Utility
 * Normalizes user search queries to match device models in database
 */

export interface NormalizedQuery {
  original: string;
  normalized: string;
  slug: string;
  brand?: string;
  model?: string;
  category?: string;
}

// Common device brands
const BRANDS = {
  apple: ["iphone", "ipad", "macbook", "airpods"],
  samsung: ["galaxy", "note", "tab"],
  xiaomi: ["redmi", "poco", "mi"],
  realme: ["realme"],
  oppo: ["oppo", "reno"],
  vivo: ["vivo"],
  oneplus: ["oneplus"],
  google: ["pixel"],
  nokia: ["nokia"],
  motorola: ["moto"],
  sony: ["xperia"],
  lg: ["lg"],
  asus: ["asus", "rog"],
  dell: ["dell"],
  hp: ["hp"],
  lenovo: ["lenovo", "thinkpad"],
  acer: ["acer"],
  microsoft: ["surface"],
};

// Device categories
const CATEGORIES = {
  phone: ["phone", "mobile", "smartphone", "iphone", "galaxy", "pixel", "redmi", "poco"],
  laptop: ["laptop", "macbook", "thinkpad", "dell", "hp", "asus", "acer"],
  tablet: ["tablet", "ipad", "tab"],
  smartwatch: ["watch", "smartwatch", "band", "fit"],
};

/**
 * Normalize search query
 * Converts user input to standardized format for database queries
 */
export function normalizeSearchQuery(query: string): NormalizedQuery {
  const original = query.trim();
  const normalized = original
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "");

  const slug = normalized.replace(/\s+/g, "-");

  // Extract brand
  let brand: string | undefined;
  for (const [brandName, keywords] of Object.entries(BRANDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      brand = brandName;
      break;
    }
  }

  // Extract category
  let category: string | undefined;
  for (const [categoryName, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      category = categoryName;
      break;
    }
  }

  // Extract model (everything after brand)
  let model: string | undefined;
  if (brand) {
    const brandKeywords = BRANDS[brand as keyof typeof BRANDS];
    const modelPart = normalized
      .split(" ")
      .filter((word) => !brandKeywords.includes(word) && word !== brand)
      .join(" ");
    if (modelPart) {
      model = modelPart;
    }
  } else {
    model = normalized;
  }

  return {
    original,
    normalized,
    slug,
    brand,
    model,
    category,
  };
}

/**
 * Generate search regex for MongoDB queries
 * Creates case-insensitive regex pattern for flexible matching
 */
export function generateSearchRegex(query: string): RegExp {
  const normalized = normalizeSearchQuery(query).normalized;
  const escapedQuery = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escapedQuery, "i");
}

/**
 * Check if query matches device name
 */
export function matchesDeviceName(query: string, deviceName: string): boolean {
  const normalizedQuery = normalizeSearchQuery(query).normalized;
  const normalizedDevice = deviceName.toLowerCase().replace(/\s+/g, " ");
  return normalizedDevice.includes(normalizedQuery) || normalizedQuery.includes(normalizedDevice);
}

/**
 * Suggest device based on partial query
 */
export function suggestDeviceCategory(query: string): string | undefined {
  const { category } = normalizeSearchQuery(query);
  return category;
}

/**
 * Extract brand from query
 */
export function extractBrand(query: string): string | undefined {
  const { brand } = normalizeSearchQuery(query);
  return brand;
}

/**
 * Create model slug from device name
 */
export function createModelSlug(deviceName: string): string {
  return deviceName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): { valid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: "Search query cannot be empty" };
  }

  if (query.length < 2) {
    return { valid: false, error: "Search query must be at least 2 characters" };
  }

  if (query.length > 100) {
    return { valid: false, error: "Search query cannot exceed 100 characters" };
  }

  return { valid: true };
}

