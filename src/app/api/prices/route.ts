import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Price } from "@/lib/schema";
import mongoose from "mongoose";

/**
 * GET /api/prices
 * Fetch prices for multiple devices
 * Query params:
 *   - deviceIds: comma-separated device IDs
 *   - limit: max results per device (default: 10)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceIdsParam = searchParams.get("deviceIds");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!deviceIdsParam) {
      return NextResponse.json(
        { success: false, error: "deviceIds parameter is required" },
        { status: 400 }
      );
    }

    // Parse device IDs
    const deviceIds = deviceIdsParam
      .split(",")
      .map((id) => {
        try {
          return new mongoose.Types.ObjectId(id.trim());
        } catch {
          return null;
        }
      })
      .filter((id) => id !== null);

    if (deviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid device IDs provided" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch prices for all devices
    const prices = await Price.find({ deviceId: { $in: deviceIds } })
      .sort({ price: 1 })
      .limit(limit * deviceIds.length)
      .lean();

    if (prices.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "No prices found for the given devices",
        },
        { status: 200 }
      );
    }

    // Format response
    const formattedPrices = prices.map((price: any) => ({
      _id: String(price._id),
      deviceId: String(price.deviceId),
      platform: price.platform,
      price: price.price,
      condition: price.condition,
      location: price.location,
      sellerName: price.sellerName || "Unknown",
      url: price.url,
      description: price.description,
      images: price.images || [],
      lastScraped: price.lastScraped,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedPrices,
        count: formattedPrices.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}

