import { Device, Price } from "@/lib/schema";

// In-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

function getCacheKey(key: string): string {
  return `cache:${key}`;
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Get all devices with prices in a single optimized query
 */
export async function getDevicesWithPrices(limit: number = 50) {
  const cacheKey = getCacheKey(`devices-with-prices-${limit}`);
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // Fetch all devices
    const devices = await Device.find()
      .select("_id name brand modelSlug category image")
      .lean()
      .limit(limit)
      .exec();

    if (devices.length === 0) {
      return [];
    }

    // Get device IDs
    const deviceIds = devices.map((d: any) => d._id);

    // Fetch all prices for these devices in one query
    const prices = await Price.find({ deviceId: { $in: deviceIds } })
      .select("deviceId price")
      .lean()
      .exec();

    // Create a map of device ID to lowest price
    const priceMap = new Map<string, number>();
    prices.forEach((p: any) => {
      const key = p.deviceId.toString();
      const current = priceMap.get(key);
      if (!current || p.price < current) {
        priceMap.set(key, p.price);
      }
    });

    // Combine data and serialize ObjectIds
    const result = devices.map((device: any) => ({
      _id: device._id.toString(),
      name: device.name,
      brand: device.brand,
      modelSlug: device.modelSlug,
      category: device.category,
      image: device.image,
      lowestPrice: priceMap.get(device._id.toString()) || 0,
    }));

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.warn("⚠️ Error fetching devices with prices (will use fallback):", error);
    return [];
  }
}

/**
 * Get trending devices (top 5 by listing count)
 */
export async function getTrendingDevices() {
  const cacheKey = getCacheKey("trending-devices");
  
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const devices = await getDevicesWithPrices(100);
    
    // Get listing counts for each device
    const deviceIds = devices.map((d: any) => d._id);
    const listingCounts = await Price.aggregate([
      { $match: { deviceId: { $in: deviceIds } } },
      { $group: { _id: "$deviceId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    listingCounts.forEach((item: any) => {
      countMap.set(item._id.toString(), item.count);
    });

    const trending = devices
      .map((device: any) => ({
        ...device,
        searches: (countMap.get(device._id.toString()) || 0) * 10,
      }))
      .sort((a: any, b: any) => b.searches - a.searches)
      .slice(0, 5);

    cache.set(cacheKey, { data: trending, timestamp: Date.now() });

    return trending;
  } catch (error) {
    console.warn("⚠️ Error fetching trending devices (will use fallback):", error);
    return [];
  }
}

/**
 * Get all unique locations
 */
export async function getAllLocations() {
  const cacheKey = getCacheKey("all-locations");
  
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const locations = await Price.distinct("location").lean().exec();
    const result = (locations || []).filter(Boolean) as string[];

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.warn("⚠️ Error fetching locations (will use fallback):", error);
    return [];
  }
}

/**
 * Get device with all its prices
 */
export async function getDeviceWithPrices(modelSlug: string) {
  const cacheKey = getCacheKey(`device-${modelSlug}`);
  
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const device = await Device.findOne({ modelSlug: modelSlug.toLowerCase() })
      .lean()
      .exec();

    if (!device) {
      return null;
    }

    const prices = await Price.find({ deviceId: (device as any)._id })
      .sort({ price: 1 })
      .lean()
      .exec();

    // Serialize ObjectIds for client component compatibility
    const serializedDevice = {
      ...device,
      _id: (device as any)._id.toString(),
    };

    const serializedPrices = prices.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      deviceId: p.deviceId.toString(),
    }));

    const result = {
      device: serializedDevice,
      prices: serializedPrices,
      stats: {
        lowestPrice: prices.length > 0 ? prices[0].price : 0,
        highestPrice: prices.length > 0 ? prices[prices.length - 1].price : 0,
        averagePrice: prices.length > 0
          ? Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length)
          : 0,
        totalListings: prices.length,
      },
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.warn("⚠️ Error fetching device with prices (will use fallback):", error);
    return null;
  }
}

/**
 * Clear cache (useful for manual invalidation)
 */
export function clearCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

