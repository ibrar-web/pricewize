import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device } from "@/lib/schema";
import { mockDevices } from "@/lib/mockData";

/**
 * GET /api/devices
 * Fetch all devices (paginated)
 * Falls back to mock data if MongoDB is not available
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    try {
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
    } catch (dbError) {
      console.warn("⚠️ MongoDB connection failed, using mock data");
      console.warn("To use real data, set MONGODB_URI in .env.local");

      // Use mock data as fallback
      let devices = mockDevices;

      if (category) {
        devices = devices.filter((d: any) => d.category === category);
      }

      const total = devices.length;
      const paginatedDevices = devices.slice(
        (page - 1) * limit,
        page * limit
      );

      return NextResponse.json(
        {
          success: true,
          data: paginatedDevices,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          warning: "Using mock data - MongoDB not connected. Set MONGODB_URI in .env.local",
        },
        { status: 200 }
      );
    }
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

