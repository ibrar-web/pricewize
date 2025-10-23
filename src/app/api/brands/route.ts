import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device } from "@/lib/schema";

export const revalidate = 300; // ISR: Cache for 5 minutes

/**
 * GET /api/brands
 * Fetch all brands with device counts and categories
 * Returns array of brands with their statistics
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    // Aggregate brands with their device counts and categories
    const brands = await Device.aggregate([
      {
        $group: {
          _id: "$brand",
          totalDevices: { $sum: 1 },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $sort: { totalDevices: -1 },
      },
      {
        $project: {
          _id: 0,
          brand: "$_id",
          totalDevices: 1,
          categories: 1,
        },
      },
    ]);

    const response = NextResponse.json(
      {
        success: true,
        data: brands,
        total: brands.length,
      },
      { status: 200 }
    );

    // Add caching headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.warn("⚠️ Error fetching brands:", error);

    // Return empty array as fallback
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        error: "Failed to fetch brands",
      },
      { status: 500 }
    );
  }
}

