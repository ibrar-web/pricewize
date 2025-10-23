# Mobile Brands Expansion - Complete List

## Overview
Updated the `extractBrand()` function in `src/lib/scraper/normalizeModel.ts` to recognize and extract all major mobile device brands from device model names.

## Supported Brands

### Premium Brands
- **Apple**: iPhone, iPad, MacBook
- **Samsung**: Galaxy S, Galaxy A, Galaxy Z series
- **Google**: Pixel series
- **OnePlus**: OnePlus numbered series

### Chinese Brands
- **Xiaomi**: Xiaomi, Redmi, POCO
- **Oppo**: Oppo, Reno series
- **Vivo**: Vivo, iQOO
- **Realme**: Realme series
- **Huawei**: Huawei P series, Honor

### Other Major Brands
- **Motorola**: Motorola, Moto G series
- **Nokia**: Nokia series
- **HTC**: HTC series
- **LG**: LG series
- **Sony**: Sony, Xperia series
- **Asus**: Asus, ROG Phone series

### Legacy/Regional Brands
- **ZTE**: ZTE, Nubia
- **Lenovo**: Lenovo series
- **TCL**: TCL series
- **Micromax**: Micromax series
- **Karbonn**: Karbonn series
- **Lava**: Lava series
- **Intex**: Intex series
- **iBall**: iBall series
- **Panasonic**: Panasonic series
- **Blackberry**: Blackberry series
- **Windows**: Windows Phone series

### Carrier Brands
- Verizon
- AT&T
- Sprint

## Normalization Patterns

The system now recognizes and normalizes device names for all brands:

### Apple
- `iPhone 15 Pro Max` → iPhone 15 Pro Max
- `iPad Pro 12.9` → iPad Pro 12.9
- `MacBook Air M3` → MacBook Air M3

### Samsung
- `Samsung Galaxy S24 Ultra` → Samsung Galaxy S24 Ultra
- `Samsung Galaxy Z Fold 6` → Samsung Galaxy Z Fold 6
- `Samsung Galaxy A54` → Samsung Galaxy A54

### Google
- `Google Pixel 8 Pro` → Google Pixel 8 Pro
- `Pixel 8` → Pixel 8

### Xiaomi
- `Xiaomi 14 Pro` → Xiaomi 14 Pro
- `Redmi Note 13 Pro` → Redmi Note 13 Pro
- `POCO X6` → POCO X6

### Oppo
- `Oppo Reno 11 Pro` → Oppo Reno 11 Pro
- `Oppo A78` → Oppo A78

### Vivo
- `Vivo X100 Pro` → Vivo X100 Pro
- `iQOO 12` → iQOO 12

### Realme
- `Realme 12 Pro` → Realme 12 Pro

### Motorola
- `Motorola Moto G54` → Motorola Moto G54
- `Moto G Stylus` → Moto G Stylus

### Sony
- `Sony Xperia 1 VI` → Sony Xperia 1 VI

### Asus
- `Asus ROG Phone 8 Pro` → Asus ROG Phone 8 Pro

### Huawei
- `Huawei P60 Pro` → Huawei P60 Pro
- `Honor 90` → Honor 90

## How It Works

1. **Model Normalization**: Device model names are normalized to a standard format
2. **Brand Extraction**: The normalized name is checked against the brands list
3. **Fallback**: If no brand is found, returns "Other"

### Example Flow
```
Input: "iphone 15 pro max"
  ↓
Normalize: "iPhone 15 Pro Max"
  ↓
Extract Brand: "iPhone"
  ↓
Output: "iPhone"
```

## Usage

```typescript
import { extractBrand, normalizeModel } from "@/lib/scraper/normalizeModel";

// Extract brand from model name
const brand = extractBrand("Samsung Galaxy S24 Ultra");
console.log(brand); // "Samsung"

// Normalize model name
const normalized = normalizeModel("iphone 15 pro max");
console.log(normalized); // "iPhone 15 Pro Max"
```

## Integration Points

The brand extraction is used in:
1. **Scraper**: `src/app/api/scraper/trigger/route.ts` - Extracts brand when scraping listings
2. **Price Schema**: `src/lib/schema/Price.ts` - Stores brand with each price
3. **Device Schema**: `src/lib/schema/Device.ts` - Stores brand with device
4. **Platform Schema**: `src/lib/schema/Platform.ts` - Aggregates brands per platform
5. **UI Components**: Display brand badges and filters

## Performance

- **Lookup Time**: O(n) where n = number of brands (~50)
- **Caching**: Brands are extracted once during scraping and cached in database
- **Memory**: Minimal impact - brands list is small and static

## Future Enhancements

1. Add more regional brands as needed
2. Implement brand logo/icon mapping
3. Add brand-specific filtering in UI
4. Create brand popularity analytics
5. Add brand comparison features

## Testing

To test brand extraction:
```bash
npm run dev
# Visit http://localhost:3000/api/devices/test
# Check the brand field in the response
```

## Files Modified
- `src/lib/scraper/normalizeModel.ts` - Added 50+ brands and normalization patterns

