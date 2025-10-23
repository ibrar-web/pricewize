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
    [/samsung\s*galaxy\s*z\s*fold/i, "Samsung Galaxy Z Fold"],
    [/samsung\s*galaxy\s*z\s*flip/i, "Samsung Galaxy Z Flip"],

    // OnePlus patterns
    [/oneplus\s*(\d+)\s*pro/i, "OnePlus $1 Pro"],
    [/oneplus\s*(\d+)/i, "OnePlus $1"],

    // Google Pixel patterns
    [/google\s*pixel\s*(\d+)\s*pro/i, "Google Pixel $1 Pro"],
    [/google\s*pixel\s*(\d+)/i, "Google Pixel $1"],
    [/pixel\s*(\d+)\s*pro/i, "Pixel $1 Pro"],
    [/pixel\s*(\d+)/i, "Pixel $1"],

    // Xiaomi patterns
    [/xiaomi\s*(\d+)\s*pro/i, "Xiaomi $1 Pro"],
    [/xiaomi\s*(\d+)/i, "Xiaomi $1"],
    [/redmi\s*note\s*(\d+)\s*pro/i, "Redmi Note $1 Pro"],
    [/redmi\s*note\s*(\d+)/i, "Redmi Note $1"],
    [/redmi\s*(\d+)/i, "Redmi $1"],
    [/poco\s*(\d+)/i, "POCO $1"],

    // Oppo patterns
    [/oppo\s*reno\s*(\d+)\s*pro/i, "Oppo Reno $1 Pro"],
    [/oppo\s*reno\s*(\d+)/i, "Oppo Reno $1"],
    [/oppo\s*(\d+)/i, "Oppo $1"],

    // Vivo patterns
    [/vivo\s*(\d+)\s*pro/i, "Vivo $1 Pro"],
    [/vivo\s*(\d+)/i, "Vivo $1"],
    [/iqoo\s*(\d+)/i, "iQOO $1"],

    // Realme patterns
    [/realme\s*(\d+)\s*pro/i, "Realme $1 Pro"],
    [/realme\s*(\d+)/i, "Realme $1"],

    // Motorola patterns
    [/motorola\s*moto\s*g\s*(\d+)/i, "Motorola Moto G $1"],
    [/moto\s*g\s*(\d+)/i, "Moto G $1"],
    [/motorola\s*(\d+)/i, "Motorola $1"],

    // MacBook patterns
    [/macbook\s*pro\s*(\d+)/i, "MacBook Pro $1"],
    [/macbook\s*air\s*(\d+)/i, "MacBook Air $1"],

    // iPad patterns
    [/ipad\s*pro\s*(\d+)/i, "iPad Pro $1"],
    [/ipad\s*air\s*(\d+)/i, "iPad Air $1"],
    [/ipad\s*(\d+)/i, "iPad $1"],

    // Sony Xperia patterns
    [/sony\s*xperia\s*(\d+)/i, "Sony Xperia $1"],
    [/xperia\s*(\d+)/i, "Xperia $1"],

    // Asus ROG patterns
    [/asus\s*rog\s*phone\s*(\d+)/i, "Asus ROG Phone $1"],
    [/asus\s*(\d+)/i, "Asus $1"],

    // HTC patterns
    [/htc\s*(\d+)/i, "HTC $1"],

    // LG patterns
    [/lg\s*(\d+)/i, "LG $1"],

    // Nokia patterns
    [/nokia\s*(\d+)/i, "Nokia $1"],

    // Huawei patterns
    [/huawei\s*p(\d+)\s*pro/i, "Huawei P$1 Pro"],
    [/huawei\s*p(\d+)/i, "Huawei P$1"],
    [/honor\s*(\d+)/i, "Honor $1"],
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
  const brands = [
    // Apple
    "iPhone",
    "iPad",
    "MacBook",

    // Samsung
    "Samsung",

    // Google
    "Google",
    "Pixel",

    // OnePlus
    "OnePlus",

    // Xiaomi
    "Xiaomi",
    "Redmi",
    "POCO",

    // Oppo
    "Oppo",
    "Reno",

    // Vivo
    "Vivo",
    "iQOO",

    // Realme
    "Realme",

    // Motorola
    "Motorola",
    "Moto",

    // Nokia
    "Nokia",

    // HTC
    "HTC",

    // LG
    "LG",

    // Sony
    "Sony",
    "Xperia",

    // Huawei
    "Huawei",
    "Honor",

    // ZTE
    "ZTE",
    "Nubia",

    // Asus
    "Asus",
    "ROG",

    // Lenovo
    "Lenovo",

    // TCL
    "TCL",

    // Micromax
    "Micromax",

    // Karbonn
    "Karbonn",

    // Lava
    "Lava",

    // Intex
    "Intex",

    // iBall
    "iBall",

    // Panasonic
    "Panasonic",

    // Blackberry
    "Blackberry",

    // Windows Phone
    "Windows",

    // Others
    "Verizon",
    "AT&T",
    "Sprint",
  ];

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

