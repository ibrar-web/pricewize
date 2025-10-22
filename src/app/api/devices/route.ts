import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device } from "@/lib/schema";

/**
 * GET /api/devices
 * Fetch all devices (paginated)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    await connectDB();

    // Build query
    const query = category ? { category } : {};

    // Get total count
    const total = await Device.countDocuments(query);

    // Get paginated devices
    const devices = await Device.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: devices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch devices",
      },
      { status: 500 }
    );
  }
}

