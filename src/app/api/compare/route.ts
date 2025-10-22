import { NextRequest, NextResponse } from "next/server";
import { connectDB, Device, Price } from "@/lib/db";
import { calculatePriceStats, formatPrice } from "@/lib/utils/formatPrice";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceIds } = body;

    // Validate input
    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 device IDs are required for comparison" },
        { status: 400 }
      );
    }

    if (deviceIds.length > 5) {
      return NextResponse.json(
        { success: false, error: "Cannot compare more than 5 devices" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch devices
    const devices = await Device.find({ _id: { $in: deviceIds } }).lean();

    if (devices.length !== deviceIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more devices not found" },
        { status: 404 }
      );
    }

    // Fetch prices for all devices
    const allPrices = await Price.find({ deviceId: { $in: deviceIds } })
      .sort({ price: 1 })
      .lean();

    // Group prices by device
    const pricesByDevice = deviceIds.reduce(
      (acc, deviceId) => {
        acc[deviceId] = allPrices.filter((p) => p.deviceId.toString() === deviceId);
        return acc;
      },
      {} as Record<string, typeof allPrices>
    );

    // Build comparison data
    const comparisonData = devices.map((device: any) => {
      const devicePrices = pricesByDevice[device._id.toString()] || [];
      const priceValues = devicePrices.map((p: any) => p.price);
      const stats = calculatePriceStats(priceValues);

      return {
        device: {
          id: device._id,
          name: device.name,
          brand: device.brand,
          modelSlug: device.modelSlug,
          category: device.category,
          image: device.image,
        },
        prices: devicePrices.map((p: any) => ({
          platform: p.platform,
          price: p.price,
          formattedPrice: formatPrice(p.price),
          condition: p.condition,
          location: p.location,
        })),
        statistics: {
          lowestPrice: formatPrice(stats.min),
          highestPrice: formatPrice(stats.max),
          averagePrice: formatPrice(stats.average),
          totalListings: stats.count,
        },
      };
    });

    // Calculate overall comparison stats
    const allDevicePrices = allPrices.map((p) => p.price);
    const overallStats = calculatePriceStats(allDevicePrices);

    return NextResponse.json(
      {
        success: true,
        message: "Comparison data retrieved successfully",
        data: {
          devices: comparisonData,
          overallStatistics: {
            lowestPrice: formatPrice(overallStats.min),
            highestPrice: formatPrice(overallStats.max),
            averagePrice: formatPrice(overallStats.average),
            totalListings: overallStats.count,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Compare API error:", error);
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

