import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";
import { mockDevices } from "@/lib/mockData";

/**
 * GET /api/devices
 * Fetch all devices (paginated) or search devices
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 20)
 *   - category: filter by category
 *   - brand: filter by brand
 *   - search: search by name or brand
 *   - minPrice: minimum price filter (optional)
 *   - maxPrice: maximum price filter (optional)
 *   - location: filter by location (optional)
 * Falls back to mock data if MongoDB is not available
 */
export const revalidate = 60; // ISR: Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined;
    const location = searchParams.get("location");

    try {
      await connectDB();

      // Build query
      let query: any = {};

      if (category) {
        query.category = category;
      }

      if (brand) {
        query.brand = brand;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { modelSlug: { $regex: search, $options: "i" } },
        ];
      }

      // Get total count
      const total = await Device.countDocuments(query);

      // Get paginated devices
      const devices = await Device.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Fetch lowest price for each device and apply filters
      let devicesWithPrices = await Promise.all(
        devices.map(async (device: any) => {
          let priceQuery: any = { deviceId: device._id };

          // Apply location filter if provided
          if (location) {
            priceQuery.location = location;
          }

          const lowestPrice = await Price.findOne(priceQuery)
            .sort({ price: 1 })
            .select("price")
            .lean() as any;

          return {
            ...device,
            _id: device._id.toString(),
            lowestPrice: lowestPrice?.price || null,
          };
        })
      );

      // Apply price range filters
      if (minPrice !== undefined || maxPrice !== undefined) {
        devicesWithPrices = devicesWithPrices.filter((device: any) => {
          if (device.lowestPrice === null) return false;
          if (minPrice !== undefined && device.lowestPrice < minPrice) return false;
          if (maxPrice !== undefined && device.lowestPrice > maxPrice) return false;
          return true;
        });
      }

      const response = NextResponse.json(
        {
          success: true,
          data: devicesWithPrices,
          pagination: {
            page,
            limit,
            total: devicesWithPrices.length,
            pages: Math.ceil(devicesWithPrices.length / limit),
          },
        },
        { status: 200 }
      );

      // Add caching headers
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return response;
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

      const response = NextResponse.json(
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

      // Add caching headers
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return response;
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

