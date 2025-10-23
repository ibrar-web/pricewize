import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";

/**
 * GET /api/devices/trending
 * Fetch trending devices with lowest prices
 * Returns top devices sorted by number of listings (popularity)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectDB();

    // Get all devices as plain objects
    const devices = await Device.find().lean().limit(100);

    if (devices.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No devices found",
        },
        { status: 200 }
      );
    }

    // For each device, get the lowest price and count listings
    const trendingData = await Promise.all(
      devices.map(async (device) => {
        const prices = await Price.find({ deviceId: device._id })
          .sort({ price: 1 })
          .lean();

        if (prices.length === 0) {
          return null;
        }

        const lowestPrice = prices[0].price;
        const totalListings = prices.length;

        return {
          id: String(device._id),
          name: device.name,
          brand: device.brand,
          modelSlug: device.modelSlug,
          image: device.image,
          lowestPrice,
          totalListings,
          // Use total listings as a proxy for "searches/popularity"
          searches: totalListings * 10, // Multiply for display purposes
        };
      })
    );

    // Filter out null values and sort by total listings (popularity)
    const filtered = trendingData
      .filter((item) => item !== null)
      .sort((a, b) => (b?.totalListings || 0) - (a?.totalListings || 0))
      .slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        data: filtered,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching trending devices:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending devices",
      },
      { status: 500 }
    );
  }
}

