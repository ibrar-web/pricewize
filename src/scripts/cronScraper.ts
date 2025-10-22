/**
 * Cron Scraper Script
 * Run this script periodically (e.g., daily) to update device listings
 *
 * Usage:
 * node scripts/cronScraper.js
 *
 * Or with npm:
 * npm run scrape
 */

import { runAllScrapers } from "../lib/scraper/index";
import { connectDB } from "../lib/db";
import { Price, ScrapeLog } from "../lib/schema";

async function main() {
  console.log("🚀 Starting cron scraper at", new Date().toISOString());

  try {
    // Connect to database
    console.log("📦 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Run all scrapers
    console.log("🔄 Running scrapers...");
    const results = await runAllScrapers();

    // Log results
    console.log("\n📊 Scraper Results:");
    results.forEach((result) => {
      if (result.success) {
        console.log(
          `  ✅ ${result.platform}: ${result.itemsScraped} items scraped`
        );
      } else {
        console.log(`  ❌ ${result.platform}: ${result.error}`);
      }
    });

    // Log scrape results to database
    console.log("\n📝 Logging scrape results...");
    for (const result of results) {
      await ScrapeLog.create({
        platform: result.platform,
        status: result.success ? "success" : "error",
        message: result.error || "Scraping completed successfully",
        itemsScraped: result.itemsScraped,
        duration: result.timestamp ? Date.now() - result.timestamp.getTime() : 0,
      });
    }
    console.log("✅ Scrape results logged");

    // Clean up old prices (older than 30 days)
    console.log("\n🧹 Cleaning up old listings...");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const deleted = await Price.deleteMany({ lastScraped: { $lt: cutoffDate } });
    console.log(`  ✅ Deleted ${deleted.deletedCount} old listings`);

    console.log("\n✅ Cron scraper completed successfully at", new Date().toISOString());
    process.exit(0);
  } catch (error) {
    console.error("❌ Cron scraper failed:", error);
    process.exit(1);
  }
}

main();

