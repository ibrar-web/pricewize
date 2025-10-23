import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, Price, ScrapeLog } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get total devices
    const totalDevices = await Device.countDocuments();

    // Get total prices
    const totalPrices = await Price.countDocuments();

    // Get unique platforms
    const platforms = await Price.distinct("platform");
    const totalPlatforms = platforms.length;

    // Get last scrape time
    const lastScrape = await ScrapeLog.findOne().sort({ createdAt: -1 });
    const lastScraped = lastScrape
      ? new Date(lastScrape.createdAt).toLocaleString()
      : "Never";

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalDevices,
          totalPrices,
          totalPlatforms,
          lastScraped,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

