# Platform Comparison Feature - Implementation Guide

## Overview

The PriceWize platform comparison feature allows users to see prices for the same device across multiple platforms (OLX, PriceOye, etc.) with detailed statistics and comparisons.

## Architecture

### 1. Database Schema

**Device Collection**
- Stores device information (name, brand, modelSlug, category, images)
- Each device can have multiple prices from different platforms

**Price Collection**
- Stores individual price listings
- Key fields:
  - `deviceId`: Reference to Device
  - `platform`: "OLX" | "PriceOye" | "Other"
  - `price`: Listing price
  - `condition`: "Excellent" | "Good" | "Fair" | "Poor"
  - `location`, `sellerName`, `url`, `images`

**Indexes for Performance**
```typescript
PriceSchema.index({ deviceId: 1, platform: 1 });  // Fast platform lookup
PriceSchema.index({ deviceId: 1, price: 1 });     // Fast price sorting
PriceSchema.index({ platform: 1, lastScraped: -1 }); // Platform statistics
```

### 2. API Endpoint

**GET /api/devices/[model]**

Returns device details with platform comparison:

```json
{
  "success": true,
  "data": {
    "device": {
      "id": "...",
      "name": "Samsung Galaxy A25",
      "brand": "Samsung",
      "modelSlug": "samsung-galaxy-a25",
      "category": "phone",
      "image": "..."
    },
    "listings": [...],
    "platformComparison": [
      {
        "platform": "OLX",
        "totalListings": 5,
        "newListings": 2,
        "usedListings": 3,
        "lowestPrice": 45000,
        "highestPrice": 65000,
        "averagePrice": 55000,
        "listings": [...]
      },
      {
        "platform": "PriceOye",
        "totalListings": 1,
        "newListings": 1,
        "usedListings": 0,
        "lowestPrice": 63099,
        "highestPrice": 63099,
        "averagePrice": 63099,
        "listings": [...]
      }
    ],
    "statistics": {
      "lowestPrice": 45000,
      "highestPrice": 65000,
      "averagePrice": 55000,
      "totalListings": 6,
      "byPlatform": {
        "OLX": 5,
        "PriceOye": 1
      }
    }
  }
}
```

### 3. Frontend Components

**PlatformComparison Component** (`src/components/PlatformComparison.tsx`)

Displays:
- Platform cards with price ranges
- New vs Used listing counts
- Average price per platform
- Price comparison bar chart
- "Best Price" badge for lowest price

**Device Details Page** (`src/app/devices/[model]/page.tsx`)

Integrates:
- Device header with image
- Overall price statistics
- Platform comparison section
- Individual listings by platform

## Scalability for Future Platforms

### Adding a New Platform

1. **Update Price Schema** (`src/lib/schema/Price.ts`)
   ```typescript
   platform: {
     type: String,
     enum: ["OLX", "PriceOye", "NewPlatform", "Other"],
     required: [true, "Platform is required"],
     index: true,
   }
   ```

2. **Update ScrapeLog Schema** (`src/lib/schema/ScrapeLog.ts`)
   ```typescript
   platform: {
     type: String,
     enum: ["OLX", "PriceOye", "NewPlatform", "All"],
     required: [true, "Platform is required"],
     index: true,
   }
   ```

3. **Create New Scraper** (`src/lib/scraper/newPlatformScraper.ts`)
   ```typescript
   export async function scrapeNewPlatform(query: string) {
     // Implement scraping logic
     return {
       listings: [...],
       platform: "NewPlatform"
     };
   }
   ```

4. **Register Scraper** (`src/lib/scraper/index.ts`)
   ```typescript
   export { scrapeNewPlatform } from "./newPlatformScraper";
   ```

5. **Update Trigger API** (`src/app/api/scraper/trigger/route.ts`)
   - Add platform case in platform conversion logic
   - Add to "all" platforms array

6. **Update UI Colors** (`src/components/PlatformComparison.tsx`)
   ```typescript
   case "newplatform":
     return {
       bg: "bg-indigo-50",
       border: "border-indigo-200",
       badge: "bg-indigo-100 text-indigo-800",
       icon: "text-indigo-600",
     };
   ```

## Data Flow

```
1. Scraper triggers → Fetches listings from platform
2. Listings saved to Price collection with platform field
3. API groups prices by platform
4. Calculates statistics per platform
5. Frontend displays comparison
```

## Performance Considerations

- **Indexes**: Compound indexes on `deviceId + platform` for fast lookups
- **Caching**: ISR (Incremental Static Regeneration) on device pages
- **Lazy Loading**: Platform comparison loads with page
- **Aggregation**: Statistics calculated server-side

## Testing

### Test Multi-Platform Device

```bash
# Scrape from both platforms
curl -X POST http://localhost:3000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"platform":"all","query":"samsung"}'

# Check device details
curl http://localhost:3000/api/devices/samsung-galaxy-a25 | jq '.data.platformComparison'

# View in browser
http://localhost:3000/devices/samsung-galaxy-a25
```

## Future Enhancements

1. **Price History**: Track price changes over time per platform
2. **Alerts**: Notify users when price drops on specific platforms
3. **Seller Ratings**: Show seller ratings per platform
4. **Availability**: Show stock availability per platform
5. **Trending**: Show which platforms have most listings

