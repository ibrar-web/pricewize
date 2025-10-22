/**
 * Normalize device model names across different platforms
 * Handles variations like "iPhone 13 Pro Max", "iPhone13ProMax", "iphone 13 pro max"
 */

export function normalizeModel(model: string): string {
  if (!model) return "";

  // Convert to lowercase and trim
  let normalized = model.toLowerCase().trim();

  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, " ");

  // Standardize common patterns
  const patterns: [RegExp, string][] = [
    // iPhone patterns
    [/iphone\s*(\d+)\s*pro\s*max/i, "iPhone $1 Pro Max"],
    [/iphone\s*(\d+)\s*pro/i, "iPhone $1 Pro"],
    [/iphone\s*(\d+)\s*plus/i, "iPhone $1 Plus"],
    [/iphone\s*(\d+)/i, "iPhone $1"],

    // Samsung Galaxy patterns
    [/samsung\s*galaxy\s*s(\d+)\s*ultra/i, "Samsung Galaxy S$1 Ultra"],
    [/samsung\s*galaxy\s*s(\d+)\s*plus/i, "Samsung Galaxy S$1 Plus"],
    [/samsung\s*galaxy\s*s(\d+)/i, "Samsung Galaxy S$1"],
    [/samsung\s*galaxy\s*a(\d+)/i, "Samsung Galaxy A$1"],

    // OnePlus patterns
    [/oneplus\s*(\d+)\s*pro/i, "OnePlus $1 Pro"],
    [/oneplus\s*(\d+)/i, "OnePlus $1"],

    // MacBook patterns
    [/macbook\s*pro\s*(\d+)/i, "MacBook Pro $1"],
    [/macbook\s*air\s*(\d+)/i, "MacBook Air $1"],

    // iPad patterns
    [/ipad\s*pro\s*(\d+)/i, "iPad Pro $1"],
    [/ipad\s*air\s*(\d+)/i, "iPad Air $1"],
    [/ipad\s*(\d+)/i, "iPad $1"],
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(normalized)) {
      normalized = normalized.replace(pattern, replacement);
      break;
    }
  }

  return normalized;
}

export function extractBrand(model: string): string {
  const normalized = normalizeModel(model);
  const brands = ["iPhone", "Samsung", "OnePlus", "MacBook", "iPad", "Google"];

  for (const brand of brands) {
    if (normalized.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }

  return "Other";
}

export function extractCondition(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("excellent") || lower.includes("like new")) {
    return "Excellent";
  }
  if (lower.includes("good") || lower.includes("very good")) {
    return "Good";
  }
  if (lower.includes("fair") || lower.includes("average")) {
    return "Fair";
  }
  if (lower.includes("poor") || lower.includes("damaged")) {
    return "Poor";
  }

  return "Good"; // Default
}

