import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";

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

    await connectDB();

    // Find device by modelSlug
    const device = await Device.findOne({
      modelSlug: model.toLowerCase().replace(/\s+/g, "-"),
    });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: "Device not found",
        },
        { status: 404 }
      );
    }

    // Get all prices for this device
    const prices = await Price.find({ deviceId: device._id }).sort({
      price: 1,
    });

    if (prices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No listings found for this device",
        },
        { status: 404 }
      );
    }

    // Group prices by platform and condition
    const pricesByPlatform = prices.reduce(
      (acc, p) => {
        if (!acc[p.platform]) {
          acc[p.platform] = [];
        }
        acc[p.platform].push(p);
        return acc;
      },
      {} as Record<string, (typeof prices)[0][]>
    );

    // Calculate statistics per platform
    type PriceRecord = Record<string, typeof prices>;
    const platformStats = Object.entries(pricesByPlatform as PriceRecord).map(
      ([platform, platformPrices]) => {
        const platformPriceValues = platformPrices.map((p) => p.price);
        const newListings = platformPrices.filter(
          (p) => p.listingType === "New"
        );
        const usedListings = platformPrices.filter(
          (p) => p.listingType === "Used" || p.listingType === "Refurbished"
        );

        return {
          platform,
          totalListings: platformPrices.length,
          newListings: newListings.length,
          usedListings: usedListings.length,
          lowestPrice: Math.min(...platformPriceValues),
          highestPrice: Math.max(...platformPriceValues),
          averagePrice: Math.round(
            platformPriceValues.reduce((a: number, b: number) => a + b, 0) /
              platformPriceValues.length
          ),
          listings: platformPrices,
        };
      }
    );

    // Calculate overall statistics
    const priceValues = prices.map((p) => p.price);
    const comparison = {
      device: {
        id: device._id,
        name: device.name,
        brand: device.brand,
        modelSlug: device.modelSlug,
        category: device.category,
        image: device.image,
      },
      listings: prices,
      platformComparison: platformStats,
      statistics: {
        lowestPrice: Math.min(...priceValues),
        highestPrice: Math.max(...priceValues),
        averagePrice: Math.round(
          priceValues.reduce((a, b) => a + b, 0) / priceValues.length
        ),
        totalListings: prices.length,
        byPlatform: prices.reduce(
          (acc, p) => {
            if (!acc[p.platform]) {
              acc[p.platform] = 0;
            }
            acc[p.platform]++;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    };

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

