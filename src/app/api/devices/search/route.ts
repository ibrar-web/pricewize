import { NextRequest, NextResponse } from "next/server";
import { connectDB, Device, Price } from "@/lib/db";
import { normalizeSearchQuery, validateSearchQuery } from "@/lib/utils/searchNormalizer";
import { calculatePriceStats, formatPrice } from "@/lib/utils/formatPrice";
import { checkRateLimit, sanitizeInput } from "@/lib/utils/security";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip, 50, 60000)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Get search query
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    // Validate query
    const validation = validateSearchQuery(query);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedQuery = sanitizeInput(query);

    // Normalize query
    const normalized = normalizeSearchQuery(sanitizedQuery);

    await connectDB();

    // Search for device in database
    let device = await Device.findOne({
      $or: [
        { modelSlug: normalized.slug },
        { name: { $regex: normalized.normalized, $options: "i" } },
        { brand: { $regex: normalized.brand || "", $options: "i" } },
      ],
    });

    // If device not found, trigger scraper
    if (!device) {
      return NextResponse.json(
        {
          success: true,
          status: "not_found",
          message: "Device not found in database. Please try a different search.",
          data: null,
        },
        { status: 404 }
      );
    }

    // Get prices for the device
    const prices = await Price.find({ deviceId: device._id })
      .sort({ price: 1 })
      .lean();

    if (prices.length === 0) {
      return NextResponse.json(
        {
          success: true,
          status: "found_no_prices",
          message: "Device found but no prices available yet.",
          data: {
            device: {
              id: device._id,
              name: device.name,
              brand: device.brand,
              modelSlug: device.modelSlug,
              category: device.category,
              image: device.image,
              description: device.description,
            },
            prices: [],
            statistics: null,
          },
        },
        { status: 200 }
      );
    }

    // Calculate statistics
    const priceValues = prices.map((p) => p.price);
    const stats = calculatePriceStats(priceValues);

    // Group prices by platform
    const pricesByPlatform = prices.reduce(
      (acc, price) => {
        if (!acc[price.platform]) {
          acc[price.platform] = [];
        }
        acc[price.platform].push(price);
        return acc;
      },
      {} as Record<string, typeof prices>
    );

    // Format response
    const formattedPrices = prices.map((price) => ({
      id: price._id,
      platform: price.platform,
      price: price.price,
      formattedPrice: formatPrice(price.price),
      condition: price.condition,
      location: price.location,
      sellerName: price.sellerName,
      url: price.url,
      description: price.description,
      images: price.images,
      lastScraped: price.lastScraped,
    }));

    return NextResponse.json(
      {
        success: true,
        status: "found",
        message: "Device and prices found successfully",
        data: {
          device: {
            id: device._id,
            name: device.name,
            brand: device.brand,
            modelSlug: device.modelSlug,
            category: device.category,
            image: device.image,
            description: device.description,
            lastUpdated: device.lastUpdated,
          },
          prices: formattedPrices,
          statistics: {
            lowestPrice: formatPrice(stats.min),
            highestPrice: formatPrice(stats.max),
            averagePrice: formatPrice(stats.average),
            medianPrice: formatPrice(stats.median),
            totalListings: stats.count,
            pricesByPlatform: Object.entries(pricesByPlatform).map(([platform, platformPrices]) => ({
              platform,
              count: platformPrices.length,
              lowestPrice: formatPrice(Math.min(...platformPrices.map((p) => p.price))),
              averagePrice: formatPrice(
                Math.round(platformPrices.reduce((sum, p) => sum + p.price, 0) / platformPrices.length)
              ),
            })),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

