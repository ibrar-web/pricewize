import { scrapeOLXPakistan } from "./olxScraper";
import { scrapeCashify } from "./cashifyScraper";
import { scrapeEBay } from "./ebayScraper";

/**
 * Main scraper orchestrator
 * Runs all scrapers and saves results to database
 */

export async function runAllScrapers(): Promise<any[]> {
  console.log("🚀 Starting all scrapers at", new Date().toISOString());

  const results: any[] = [];

  try {
    // Run scrapers in parallel
    const [olxListings, cashifyListings, ebayListings] = await Promise.all([
      scrapeOLXPakistan("iPhone"),
      scrapeCashify("iPhone"),
      scrapeEBay("iPhone"),
    ]);

    results.push(
      { platform: "OLX", count: olxListings.length, success: true },
      { platform: "Cashify", count: cashifyListings.length, success: true },
      { platform: "eBay", count: ebayListings.length, success: true }
    );

    // Log results
    results.forEach((result) => {
      if (result.success) {
        console.log(`✅ ${result.platform}: ${result.count} items scraped`);
      } else {
        console.error(`❌ ${result.platform}: ${result.error}`);
      }
    });

    console.log("✅ All scrapers completed at", new Date().toISOString());
  } catch (error) {
    console.error("Fatal scraper error:", error);
  }

  return results;
}

export { scrapeOLXPakistan, scrapeOLXPakistanWeb } from "./olxScraper";
export { scrapeCashify, scrapeCashifyAPI } from "./cashifyScraper";
export { scrapeEBay, scrapeEBayAPI } from "./ebayScraper";
export { normalizeModel, extractBrand, extractCondition } from "./normalizeModel";

