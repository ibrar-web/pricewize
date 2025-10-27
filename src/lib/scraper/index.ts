import { scrapeOLXPakistan } from "./olxScraper";
import { scrapePriceOyePakistan } from "./priceyeScraper";

/**
 * Main scraper orchestrator
 * Runs OLX and PriceOye scrapers
 */

export async function runAllScrapers(): Promise<any[]> {
  console.log("🚀 Starting all scrapers at", new Date().toISOString());

  const results: any[] = [];

  try {
    // Run OLX scraper
    const olxListings = await scrapeOLXPakistan("iPhone");
    results.push(
      { platform: "OLX", count: olxListings.length, success: true }
    );

    // Run PriceOye scraper
    const priceoyeListings = await scrapePriceOyePakistan("samsung");
    results.push(
      { platform: "PriceOye", count: priceoyeListings.length, success: true }
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
export { scrapePriceOyePakistan, scrapePriceOyePakistanWeb } from "./priceyeScraper";
export { normalizeModel, extractBrand, extractCondition } from "./normalizeModel";

