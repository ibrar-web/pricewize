import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Platform, Price } from "@/lib/schema";

/**
 * GET /api/platforms/stats
 * Fetch platform statistics with brand and listing information
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all active platforms
    const platforms = await Platform.find({ isActive: true }).lean();

    // Enrich platform data with additional statistics
    const platformStats = await Promise.all(
      platforms.map(async (platform: any) => {
        // Get all prices for this platform
        const prices = await Price.find({ platform: platform.name }).lean();
        
        // Calculate statistics
        const priceValues = prices.map((p: any) => p.price);
        const uniqueBrands = [...new Set(prices.map((p: any) => p.brand).filter(Boolean))];
        const uniqueLocations = [...new Set(prices.map((p: any) => p.location).filter(Boolean))];

        const stats = {
          lowestPrice: priceValues.length > 0 ? Math.min(...priceValues) : 0,
          highestPrice: priceValues.length > 0 ? Math.max(...priceValues) : 0,
          averagePrice: priceValues.length > 0 ? Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length) : 0,
        };

        return {
          name: platform.name,
          url: platform.url,
          isActive: platform.isActive,
          lastScraped: platform.lastScraped,
          totalListings: prices.length,
          totalBrands: uniqueBrands.length,
          brands: uniqueBrands,
          totalLocations: uniqueLocations.length,
          locations: uniqueLocations,
          statistics: {
            lowestPrice: stats.lowestPrice,
            highestPrice: stats.highestPrice,
            averagePrice: stats.averagePrice,
          },
          successRate: platform.successRate,
          averageResponseTime: platform.averageResponseTime,
        };
      })
    );

    // Calculate overall statistics
    const allPrices = await Price.find({}).lean();
    const allPriceValues = allPrices.map((p: any) => p.price);
    const allBrands = [...new Set(allPrices.map((p: any) => p.brand).filter(Boolean))];

    const overallStats = {
      totalPlatforms: platformStats.length,
      totalListings: allPrices.length,
      totalBrands: allBrands.length,
      lowestPrice: allPriceValues.length > 0 ? Math.min(...allPriceValues) : 0,
      highestPrice: allPriceValues.length > 0 ? Math.max(...allPriceValues) : 0,
      averagePrice: allPriceValues.length > 0 ? Math.round(allPriceValues.reduce((a, b) => a + b, 0) / allPriceValues.length) : 0,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Platform statistics retrieved successfully",
        data: {
          platforms: platformStats,
          overall: overallStats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Platform stats API error:", error);
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

