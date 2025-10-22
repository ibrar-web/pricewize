import { scrapeOLX } from "./olxScraper";
import { scrapeCashify } from "./cashifyScraper";
import { scrapeEBay } from "./ebayScraper";
import { ScraperResult } from "@/types/device";

/**
 * Main scraper orchestrator
 * Runs all scrapers and saves results to database
 */

export async function runAllScrapers(): Promise<ScraperResult[]> {
  console.log("🚀 Starting all scrapers at", new Date().toISOString());

  const results: ScraperResult[] = [];

  try {
    // Run scrapers in parallel
    const [olxResult, cashifyResult, ebayResult] = await Promise.all([
      scrapeOLX(),
      scrapeCashify(),
      scrapeEBay(),
    ]);

    results.push(olxResult, cashifyResult, ebayResult);

    // Log results
    results.forEach((result) => {
      if (result.success) {
        console.log(
          `✅ ${result.platform}: ${result.itemsScraped} items scraped`
        );
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

export async function runScraperByPlatform(
  platform: string
): Promise<ScraperResult> {
  console.log(`🚀 Starting ${platform} scraper`);

  switch (platform.toLowerCase()) {
    case "olx":
      return scrapeOLX();
    case "cashify":
      return scrapeCashify();
    case "ebay":
      return scrapeEBay();
    default:
      return {
        platform,
        itemsScraped: 0,
        timestamp: new Date(),
        success: false,
        error: "Unknown platform",
      };
  }
}

export { scrapeOLX, scrapeOLXByModel } from "./olxScraper";
export { scrapeCashify, scrapeCashifyByModel } from "./cashifyScraper";
export { scrapeEBay, scrapeEBayByModel } from "./ebayScraper";
export { normalizeModel, extractBrand, extractCondition } from "./normalizeModel";

