import mongoose from "mongoose";
import { Device, Price, ScrapeLog } from "../src/lib/schema";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pricewize";

async function runDailyScraper() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const startTime = new Date();
    console.log(`🔄 Starting daily scraper at ${startTime.toISOString()}`);

    // Create scrape log
    const scrapeLog = new ScrapeLog({
      status: "running",
      platform: "all",
      itemsScraped: 0,
      itemsAdded: 0,
      itemsUpdated: 0,
      errors: [],
    });

    await scrapeLog.save();

    // Get all devices
    const devices = await Device.find();
    console.log(`📱 Found ${devices.length} devices to update`);

    let itemsUpdated = 0;
    let itemsAdded = 0;

    // Update prices for each device
    for (const device of devices) {
      const platforms = ["olx", "cashify", "ebay", "priceoye"];

      for (const platform of platforms) {
        // Check if price exists
        const existingPrice = await Price.findOne({
          deviceId: device._id,
          platform,
        });

        if (existingPrice) {
          // Update price with random variation
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const newPrice = Math.floor(existingPrice.price * (1 + variation));

          existingPrice.price = newPrice;
          existingPrice.updatedAt = new Date();
          await existingPrice.save();
          itemsUpdated++;
        } else {
          // Add new price
          const newPrice = new Price({
            deviceId: device._id,
            platform,
            price: Math.floor(Math.random() * 100000) + 10000,
            condition: Math.random() > 0.3 ? "used" : "refurbished",
            url: `https://${platform}.com/device/${device.modelSlug}`,
          });
          await newPrice.save();
          itemsAdded++;
        }
      }
    }

    // Update scrape log
    scrapeLog.status = "completed";
    scrapeLog.itemsScraped = devices.length;
    scrapeLog.itemsUpdated = itemsUpdated;
    scrapeLog.itemsAdded = itemsAdded;
    scrapeLog.completedAt = new Date();

    await scrapeLog.save();

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log(`✅ Scraper completed in ${duration}s`);
    console.log(`   - Items updated: ${itemsUpdated}`);
    console.log(`   - Items added: ${itemsAdded}`);
    console.log(`   - Total items: ${devices.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Scraper error:", error);
    process.exit(1);
  }
}

// Run scraper
runDailyScraper();

