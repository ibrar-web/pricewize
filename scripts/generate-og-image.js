#!/usr/bin/env node

/**
 * Generate OG Image for PriceWize
 * Creates a 1200x630px image for social media sharing
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const width = 1200;
const height = 630;

// Create SVG for the OG image
const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0f172a;stop-opacity:1"/><stop offset="100%" style="stop-color:#1e293b;stop-opacity:1"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#grad1)"/><circle cx="100" cy="100" r="80" fill="#3b82f6" opacity="0.1"/><circle cx="${width - 100}" cy="${height - 100}" r="100" fill="#10b981" opacity="0.1"/><text x="${width / 2}" y="200" font-size="72" font-weight="bold" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif">PriceWize</text><text x="${width / 2}" y="280" font-size="36" text-anchor="middle" fill="#e2e8f0" font-family="Arial, sans-serif">Compare Used Device Prices</text><text x="${width / 2}" y="350" font-size="24" text-anchor="middle" fill="#cbd5e1" font-family="Arial, sans-serif">Find the best deals across OLX, Cashify, eBay and more</text><rect x="200" y="420" width="800" height="4" fill="#3b82f6" rx="2"/><text x="150" y="500" font-size="18" fill="#a1a5af" font-family="Arial, sans-serif">Real-time Comparison</text><text x="150" y="550" font-size="18" fill="#a1a5af" font-family="Arial, sans-serif">Multiple Platforms</text><text x="700" y="500" font-size="18" fill="#a1a5af" font-family="Arial, sans-serif">Best Prices</text><text x="700" y="550" font-size="18" fill="#a1a5af" font-family="Arial, sans-serif">Instant Results</text></svg>`;

// Output path
const outputPath = path.join(__dirname, "../public/og-image.jpg");

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate image
sharp(Buffer.from(svg))
  .jpeg({ quality: 90, progressive: true })
  .toFile(outputPath)
  .then((info) => {
    console.log("✅ OG image generated successfully!");
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 Size: ${info.width}x${info.height}px`);
    console.log(`💾 File size: ${(info.size / 1024).toFixed(2)}KB`);
  })
  .catch((err) => {
    console.error("❌ Error generating OG image:", err);
    process.exit(1);
  });

