import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Price } from "@/lib/schema";

interface TrendingDevice {
  id: string;
  name: string;
  brand: string;
  modelSlug: string;
  image?: string;
  lowestPrice: number;
  totalListings: number;
  searches: number;
}

/**
 * GET /api/devices/trending
 * Fetch trending devices with lowest prices
 * Returns top devices sorted by number of listings (popularity)
 * Uses MongoDB aggregation for optimal performance (single query instead of N+1)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100); // Cap at 100

    console.log(`[Trending API] Fetching top ${limit} trending devices`);
    await connectDB();

    // Optimized aggregation pipeline - single query instead of N+1
    const trendingData: TrendingDevice[] = await Price.aggregate([
      // Group by deviceId to calculate lowest price and count listings
      {
        $group: {
          _id: "$deviceId",
          lowestPrice: { $min: "$price" },
          totalListings: { $sum: 1 },
        },
      },
      // Only include devices with at least one listing
      {
        $match: {
          totalListings: { $gt: 0 },
        },
      },
      // Sort by popularity (total listings) descending
      {
        $sort: { totalListings: -1 },
      },
      // Limit results
      {
        $limit: limit,
      },
      // Join with Device collection to get device details
      {
        $lookup: {
          from: "devices",
          localField: "_id",
          foreignField: "_id",
          as: "device",
        },
      },
      // Unwind the device array (should always have 1 element)
      {
        $unwind: {
          path: "$device",
          preserveNullAndEmptyArrays: false,
        },
      },
      // Project the final shape
      {
        $project: {
          id: { $toString: "$device._id" },
          name: "$device.name",
          brand: "$device.brand",
          modelSlug: "$device.modelSlug",
          image: "$device.image",
          lowestPrice: 1,
          totalListings: 1,
          searches: { $multiply: ["$totalListings", 10] },
        },
      },
    ]);

    console.log(`[Trending API] Found ${trendingData.length} trending devices`);

    return NextResponse.json(
      {
        success: true,
        data: trendingData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Trending API] Error fetching trending devices:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending devices",
      },
      { status: 500 }
    );
  }
}
