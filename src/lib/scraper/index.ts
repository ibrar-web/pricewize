import { scrapeOLXPakistan } from "./olxScraper";

/**
 * Main scraper orchestrator
 * Runs OLX scraper only
 */

export async function runAllScrapers(): Promise<any[]> {
  console.log("🚀 Starting OLX scraper at", new Date().toISOString());

  const results: any[] = [];

  try {
    // Run OLX scraper only
    const olxListings = await scrapeOLXPakistan("iPhone");

    results.push(
      { platform: "OLX", count: olxListings.length, success: true }
    );

    // Log results
    results.forEach((result) => {
      if (result.success) {
        console.log(`✅ ${result.platform}: ${result.count} items scraped`);
      } else {
        console.error(`❌ ${result.platform}: ${result.error}`);
      }
    });

    console.log("✅ OLX scraper completed at", new Date().toISOString());
  } catch (error) {
    console.error("Fatal scraper error:", error);
  }

  return results;
}

export { scrapeOLXPakistan, scrapeOLXPakistanWeb } from "./olxScraper";
export { normalizeModel, extractBrand, extractCondition } from "./normalizeModel";

