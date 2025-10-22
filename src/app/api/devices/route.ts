import { NextResponse } from "next/server";
import { getAllDevices } from "@/lib/db";

/**
 * GET /api/devices
 * Fetch all device listings (paginated)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const devices = await getAllDevices();

    // Simple pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedDevices = devices.slice(start, end);

    return NextResponse.json(
      {
        success: true,
        data: paginatedDevices,
        pagination: {
          page,
          limit,
          total: devices.length,
          pages: Math.ceil(devices.length / limit),
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

