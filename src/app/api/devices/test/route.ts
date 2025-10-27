import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/lib/db";
import { Device, Price, ScrapeLog } from "@/lib/schema";

/**
 * GET /api/devices/test
 * Test endpoint to verify database connection and create sample data
 * Only available in development
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        error: "Test endpoint not available in production",
      },
      { status: 403 }
    );
  }

  try {
    console.log("🧪 Testing database connection...");

    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Test Device model
    console.log("📱 Testing Device model...");
    const testDevice = await Device.findOne({});
    console.log("✅ Device model working");

    // Create sample device if none exists
    let device = testDevice;
    if (!device) {
      console.log("📝 Creating sample device...");
      device = await Device.create({
        name: "iPhone 13 Pro Max",
        brand: "Apple",
        modelSlug: "iphone-13-pro-max",
        category: "phone",
        image: "https://via.placeholder.com/300",
        description: "Apple iPhone 13 Pro Max - 256GB",
      });
      console.log("✅ Sample device created");
    }

    // Test Price model
    console.log("💰 Testing Price model...");
    const testPrice = await Price.findOne({});
    console.log("✅ Price model working");

    // Create sample prices if none exist
    if (!testPrice) {
      console.log("📝 Creating sample prices...");
      await Price.create([
        {
          deviceId: device._id,
          platform: "OLX",
          price: 45000,
          condition: "Excellent",
          location: "Karachi",
          sellerName: "Tech Store",
          url: "https://olx.com.pk/item/1",
          description: "Mint condition, original box",
        },
        {
          deviceId: device._id,
          platform: "PriceOye",
          price: 48000,
          condition: "Good",
          location: "Lahore",
          sellerName: "PriceOye",
          url: "https://priceoye.pk/item/1",
          description: "Good condition",
        },
      ]);
      console.log("✅ Sample prices created");
    }

    // Test ScrapeLog model
    console.log("📊 Testing ScrapeLog model...");
    const testLog = await ScrapeLog.findOne({});
    console.log("✅ ScrapeLog model working");

    // Create sample log if none exists
    if (!testLog) {
      console.log("📝 Creating sample scrape log...");
      await ScrapeLog.create({
        platform: "All",
        status: "success",
        message: "Test scrape completed successfully",
        itemsScraped: 150,
        itemsSaved: 145,
        duration: 5234,
      });
      console.log("✅ Sample scrape log created");
    }

    // Get statistics
    const deviceCount = await Device.countDocuments();
    const priceCount = await Price.countDocuments();
    const logCount = await ScrapeLog.countDocuments();

    const stats = {
      devices: deviceCount,
      prices: priceCount,
      logs: logCount,
    };

    console.log("📊 Database Statistics:", stats);

    return NextResponse.json(
      {
        success: true,
        message: "Database connection test successful",
        data: {
          connection: "✅ Connected",
          models: {
            Device: "✅ Working",
            Price: "✅ Working",
            ScrapeLog: "✅ Working",
          },
          statistics: stats,
          sampleDevice: {
            id: device._id,
            name: device.name,
            modelSlug: device.modelSlug,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/devices/test
 * Clean up test data (development only)
 */
export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        error: "Test endpoint not available in production",
      },
      { status: 403 }
    );
  }

  try {
    console.log("🧹 Cleaning up test data...");

    await connectDB();

    // Delete all test data
    const deviceResult = await Device.deleteMany({});
    const priceResult = await Price.deleteMany({});
    const logResult = await ScrapeLog.deleteMany({});

    console.log("✅ Test data cleaned up");

    return NextResponse.json(
      {
        success: true,
        message: "Test data cleaned up",
        deleted: {
          devices: deviceResult.deletedCount,
          prices: priceResult.deletedCount,
          logs: logResult.deletedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clean up test data",
      },
      { status: 500 }
    );
  }
}

