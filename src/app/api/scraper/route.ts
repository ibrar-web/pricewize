import { NextResponse } from "next/server";
import { runAllScrapers } from "@/lib/scraper";

/**
 * POST /api/scraper
 * Trigger scraping job
 * Requires SCRAPER_SECRET header for security
 */
export async function POST(request: Request) {
  try {
    // Security check
    const secret = request.headers.get("x-scraper-secret");
    if (secret !== process.env.SCRAPER_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const results = await runAllScrapers();

    return NextResponse.json(
      {
        success: true,
        message: "Scraping job completed",
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run scraper",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scraper
 * Health check for scraper endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Scraper endpoint is active",
      note: "Use POST with x-scraper-secret header to trigger scraping",
    },
    { status: 200 }
  );
}

