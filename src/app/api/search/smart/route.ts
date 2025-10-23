import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, SearchLog } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { query, platform = "all", triggerScraper = false } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Search for devices
    const searchRegex = new RegExp(query, "i");
    const devices = await Device.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
      ],
    }).limit(20);

    // Log search
    const searchLog = new SearchLog({
      query: query.trim(),
      results: devices.length,
      platform,
      scraperTriggered: triggerScraper && devices.length === 0,
      scraperStatus: triggerScraper && devices.length === 0 ? "pending" : "completed",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
    });

    await searchLog.save();

    // Trigger scraper if no results and requested
    if (triggerScraper && devices.length === 0) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/scraper/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim(), platform }),
        });
      } catch (err) {
        console.error("Scraper trigger failed:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        devices,
        count: devices.length,
        scraperTriggered: triggerScraper && devices.length === 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

