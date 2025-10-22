import { NextResponse } from "next/server";
import { getDeviceComparison } from "@/lib/db";

/**
 * GET /api/devices/[model]
 * Fetch device comparison data for a specific model
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          error: "Model parameter is required",
        },
        { status: 400 }
      );
    }

    const comparison = await getDeviceComparison(model);

    if (!comparison) {
      return NextResponse.json(
        {
          success: false,
          error: "No listings found for this model",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: comparison,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching device comparison:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch device comparison",
      },
      { status: 500 }
    );
  }
}

