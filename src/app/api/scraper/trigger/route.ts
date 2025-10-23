import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ScrapeLog, Device, Price } from "@/lib/schema";

// Mock scraper function - in production, this would call actual scrapers
async function runScraper(query?: string) {
  const mockDevices = [
    {
      name: "iPhone 14 Pro",
      brand: "Apple",
      category: "smartphone",
      modelSlug: "iphone-14-pro",
      prices: [
        { platform: "olx", price: 62500, condition: "used" },
        { platform: "cashify", price: 65000, condition: "used" },
      ],
    },
    {
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      category: "smartphone",
      modelSlug: "samsung-galaxy-s24",
      prices: [
        { platform: "olx", price: 75000, condition: "used" },
        { platform: "priceoye", price: 78000, condition: "used" },
      ],
    },
  ];

  let results = mockDevices;
  if (query) {
    const regex = new RegExp(query, "i");
    results = mockDevices.filter(
      (d) => regex.test(d.name) || regex.test(d.brand)
    );
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { query, platform } = await request.json();

    // Create scrape log
    const scrapeLog = new ScrapeLog({
      status: "running",
      platform: platform || "all",
      itemsScraped: 0,
      itemsAdded: 0,
      itemsUpdated: 0,
      errors: [],
    });

    await scrapeLog.save();

    // Run scraper
    const scrapedData = await runScraper(query);

    let itemsAdded = 0;
    let itemsUpdated = 0;

    // Process scraped data
    for (const item of scrapedData) {
      const existingDevice = await Device.findOne({ modelSlug: item.modelSlug });

      if (!existingDevice) {
        const newDevice = new Device({
          name: item.name,
          brand: item.brand,
          category: item.category,
          modelSlug: item.modelSlug,
        });
        await newDevice.save();
        itemsAdded++;

        // Add prices
        for (const priceData of item.prices) {
          const price = new Price({
            deviceId: newDevice._id,
            platform: priceData.platform,
            price: priceData.price,
            condition: priceData.condition,
          });
          await price.save();
        }
      } else {
        itemsUpdated++;
      }
    }

    // Update scrape log
    scrapeLog.status = "completed";
    scrapeLog.itemsScraped = scrapedData.length;
    scrapeLog.itemsAdded = itemsAdded;
    scrapeLog.itemsUpdated = itemsUpdated;
    await scrapeLog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Scraper completed",
        stats: {
          itemsScraped: scrapedData.length,
          itemsAdded,
          itemsUpdated,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json(
      { error: "Scraper failed" },
      { status: 500 }
    );
  }
}

