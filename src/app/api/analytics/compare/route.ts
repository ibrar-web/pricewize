import { NextRequest, NextResponse } from "next/server";
import { connectDB, Device, Price, Platform, ScrapeLog } from "@/lib/db";
import { verifyToken } from "@/lib/utils/security";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get statistics
    const totalDevices = await Device.countDocuments();
    const totalPrices = await Price.countDocuments();
    const totalPlatforms = await Platform.countDocuments({ isActive: true });

    // Get platform statistics
    const platformStats = await Platform.find({ isActive: true }).lean();

    // Get recent scrape logs
    const recentLogs = await ScrapeLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Get price statistics
    const priceStats = await Price.aggregate([
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get category statistics
    const categoryStats = await Device.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Analytics data retrieved successfully",
        data: {
          overview: {
            totalDevices,
            totalPrices,
            totalPlatforms,
          },
          platformStats: platformStats.map((p) => ({
            name: p.name,
            isActive: p.isActive,
            lastScraped: p.lastScraped,
            totalListings: p.totalListings,
            successRate: p.successRate,
            averageResponseTime: p.averageResponseTime,
          })),
          priceStats: priceStats.map((p) => ({
            platform: p._id,
            count: p.count,
            averagePrice: Math.round(p.avgPrice),
            minPrice: p.minPrice,
            maxPrice: p.maxPrice,
          })),
          categoryStats: categoryStats.map((c) => ({
            category: c._id,
            count: c.count,
          })),
          recentLogs: recentLogs.map((log) => ({
            platform: log.platform,
            status: log.status,
            message: log.message,
            itemsScraped: log.itemsScraped,
            itemsSaved: log.itemsSaved,
            duration: log.duration,
            timestamp: log.timestamp,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

