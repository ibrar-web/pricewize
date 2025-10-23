import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all devices with their prices
    const devices = await Device.find().lean();
    const prices = await Price.find().lean();

    // Create CSV content
    let csv = "Device Name,Brand,Category,Platform,Price,Condition,URL\n";

    for (const device of devices) {
      const devicePrices = prices.filter((p: any) => p.deviceId?.toString() === device._id?.toString());

      if (devicePrices.length === 0) {
        csv += `"${device.name}","${device.brand}","${device.category}","N/A","N/A","N/A","N/A"\n`;
      } else {
        for (const price of devicePrices) {
          csv += `"${device.name}","${device.brand}","${device.category}","${price.platform}","${price.price}","${price.condition || "N/A"}","${price.url || "N/A"}"\n`;
        }
      }
    }

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="devices-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

