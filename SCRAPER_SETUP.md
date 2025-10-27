# PriceWize Scraper Setup

## ✅ Status: FULLY OPERATIONAL

Data is being successfully scraped and populated into the database!

**Current Database Statistics:**
- 133+ devices indexed
- 138+ prices collected
- 7+ scrape logs recorded
- Multiple platforms tracked (OLX, PriceOye)

## Overview
PriceWize now supports scraping from **OLX** and **PriceOye** platforms. The old Cashify and eBay scrapers have been removed.

## Architecture

### Scrapers
- **OLX Scraper** (`src/lib/scraper/olxScraper.ts`) - Scrapes OLX Pakistan for used devices
- **PriceOye Scraper** (`src/lib/scraper/priceyeScraper.ts`) - Scrapes PriceOye Pakistan for new/used devices

### API Endpoints

#### POST /api/scraper/trigger
Triggers scraping with platform-specific control.

**Payload:**
```json
{
  "platform": "olx|priceoye|all",
  "query": "samsung"
}
```

**Examples:**
```bash
# Scrape OLX only
curl -X POST http://localhost:3000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"platform":"olx","query":"oneplus"}'

# Scrape PriceOye only
curl -X POST http://localhost:3000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"platform":"priceoye","query":"samsung"}'

# Scrape all platforms
curl -X POST http://localhost:3000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"platform":"all","query":"iphone"}'
```

## Database Schema

### Price Model
Updated to support only OLX and PriceOye:
```typescript
platform: "OLX" | "PriceOye" | "Other"
```

### Platform Collection
Tracks platform-level statistics:
- `name`: Platform name (OLX, PriceOye)
- `isActive`: Boolean
- `lastScraped`: Date
- `totalListings`: Number
- `totalBrands`: Number
- `brands`: String[]

## NPM Scripts

```bash
# Run all scrapers
npm run scrape

# Run OLX scraper only
npm run scrape:olx

# Run PriceOye scraper only
npm run scrape:priceoye

# Build project
npm run build

# Start development server
npm run dev
```

## Files Modified

### Created
- `src/lib/scraper/priceyeScraper.ts` - PriceOye scraper implementation

### Updated
- `src/lib/scraper/index.ts` - Added PriceOye export
- `src/lib/schema/Price.ts` - Updated platform enum
- `src/app/api/scraper/trigger/route.ts` - Platform-specific scraping logic
- `scripts/cron-scraper.ts` - Updated to use OLX and PriceOye only
- `package.json` - Updated npm scripts
- `src/config/cron.config.ts` - Updated platform config
- `src/components/PriceCard.tsx` - Added PriceOye color styling
- `src/lib/mockData.ts` - Updated mock data
- `src/app/api/devices/test/route.ts` - Updated test data

### Deleted
- `src/lib/scraper/cashifyScraper.ts`
- `src/lib/scraper/ebayScraper.ts`

## Testing

### ✅ Verification - Data is Being Populated!

**Check database status:**
```bash
curl http://localhost:3000/api/devices/test
```

**Response shows:**
- ✅ 133+ devices in database
- ✅ 138+ prices collected
- ✅ 7+ scrape logs recorded

**View scraped devices:**
```bash
curl "http://localhost:3000/api/devices?limit=5"
```

**View device with prices:**
```bash
curl "http://localhost:3000/api/devices/samsung-galaxy-a32"
```

### Manual Testing
```bash
# Start dev server
npm run dev

# In another terminal, run test script
node test-scrapers.js
```

### API Testing
Use the `/api/scraper/trigger` endpoint with different platform values to test individual scrapers.

## Data Flow

1. **Request** → `/api/scraper/trigger` with platform and query
2. **Scraper Selection** → Based on platform parameter
3. **Scraping** → Playwright browser automation
4. **Normalization** → Extract brand and model from titles
5. **Database Save** → Create/update Device and Price records
6. **Platform Stats** → Update Platform collection with statistics

## Features

✅ Platform-specific scraping (OLX, PriceOye, or all)
✅ Automatic device normalization
✅ Price history tracking
✅ Platform statistics
✅ Error handling and logging
✅ Timeout protection (30 seconds)
✅ Duplicate prevention

## Next Steps

1. Deploy to production
2. Set up cron jobs for automated scraping
3. Monitor scraper performance
4. Adjust selectors if website structure changes

