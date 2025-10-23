import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ScrapeLog, Device, Price } from "@/lib/schema";
import { scrapeOLXPakistanWeb } from "@/lib/scraper/olxScraper";
import { normalizeModel, extractBrand } from "@/lib/scraper/normalizeModel";

/**
 * Helper to create slug from model name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Normalize condition to valid enum values
 */
function normalizeCondition(condition: string): "Excellent" | "Good" | "Fair" | "Poor" {
  const lower = condition.toLowerCase();
  if (lower.includes("excellent") || lower.includes("like new")) return "Excellent";
  if (lower.includes("good") || lower.includes("very good")) return "Good";
  if (lower.includes("fair") || lower.includes("average")) return "Fair";
  if (lower.includes("poor") || lower.includes("damaged")) return "Poor";
  return "Good"; // Default
}

/**
 * Real scraper function that calls actual marketplace scrapers
 * Processes OLX listings and normalizes them into device data
 */
async function runScraper(query: string = "iPhone") {
  try {
    console.log(`🚀 Running real scraper for query: ${query}`);

    // Scrape OLX for listings (using web scraper for server environment)
    const olxListings = await scrapeOLXPakistanWeb(query);
    console.log(`📦 OLX returned ${olxListings.length} listings`);

    // Process listings into normalized device data
    const devices: Record<string, unknown>[] = [];

    for (const listing of olxListings) {
      try {
        // Extract brand and model from title
        const brand = extractBrand(listing.title);
        const normalizedName = normalizeModel(listing.title);

        if (!brand || !normalizedName) {
          console.warn(`⚠️ Could not normalize: ${listing.title}`);
          continue;
        }

        const modelSlug = createSlug(normalizedName);

        // Check if device already exists
        const existingDevice = devices.find((d) => d.modelSlug === modelSlug);

        if (existingDevice) {
          // Add price to existing device
          (existingDevice as Record<string, unknown>).prices = [
            ...((existingDevice as Record<string, unknown>).prices as unknown[]),
            {
              platform: "OLX",
              price: listing.price,
              condition: listing.condition,
              url: listing.url,
              location: listing.location,
              image: listing.image,
              sellerName: listing.sellerName,
            },
          ];
        } else {
          // Create new device entry
          devices.push({
            name: normalizedName,
            brand,
            category: "phone",
            modelSlug,
            image: listing.image,
            description: listing.description,
            prices: [
              {
                platform: "OLX",
                price: listing.price,
                condition: listing.condition,
                url: listing.url,
                location: listing.location,
                image: listing.image,
                sellerName: listing.sellerName,
              },
            ],
          });
        }
      } catch (error) {
        console.error(`Error processing listing: ${listing.title}`, error);
      }
    }

    console.log(`✅ Processed ${devices.length} unique devices`);
    return devices;
  } catch (error) {
    console.error("Scraper error:", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📍 POST /api/scraper/trigger called");

    const { query, platform } = await request.json();
    console.log(`📝 Query: ${query}, Platform: ${platform}`);

    // Run scraper with timeout
    console.log("🚀 Starting scraper...");
    const scrapedData = await Promise.race([
      runScraper(query),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Scraper timeout")), 30000)
      ),
    ]);
    console.log(`✅ Scraper completed with ${scrapedData.length} items`);

    // Connect to DB and save data
    try {
      await connectDB();
      console.log("✅ Database connected");

      // Create scrape log
      const platformName = (platform || "OLX").toUpperCase() === "OLX" ? "OLX" : "All";
      const scrapeLog = new ScrapeLog({
        status: "partial",
        platform: platformName,
        message: `Scraping for ${query}`,
        itemsScraped: scrapedData.length,
        itemsSaved: 0,
      });

      await scrapeLog.save();
      console.log("✅ Scrape log created");

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
            image: item.image || null,
            images: item.image ? [item.image] : [],
            description: item.description || null,
          });
          await newDevice.save();
          itemsAdded++;

          // Add prices with images
          const prices = (item.prices as unknown[]) || [];
          for (const priceData of prices) {
            const pd = priceData as Record<string, unknown>;
            const price = new Price({
              deviceId: newDevice._id,
              platform: String(pd.platform).toUpperCase() === "OLX" ? "OLX" : "Other",
              price: Number(pd.price),
              condition: normalizeCondition(String(pd.condition)),
              url: String(pd.url),
              location: String(pd.location),
              sellerName: String(pd.sellerName),
              images: pd.image ? [String(pd.image)] : [],
            });
            await price.save();
          }
        } else {
          // Update existing device with new prices
          itemsUpdated++;

          // Add new prices if they don't exist
          const prices2 = (item.prices as unknown[]) || [];
          for (const priceData of prices2) {
            const pd = priceData as Record<string, unknown>;
            const existingPrice = await Price.findOne({
              url: String(pd.url),
            });

            if (!existingPrice) {
              const price = new Price({
                deviceId: existingDevice._id,
                platform: String(pd.platform).toUpperCase() === "OLX" ? "OLX" : "Other",
                price: Number(pd.price),
                condition: normalizeCondition(String(pd.condition)),
                url: String(pd.url),
                location: String(pd.location),
                sellerName: String(pd.sellerName),
                images: pd.image ? [String(pd.image)] : [],
              });
              await price.save();
            }
          }
        }
      }

      // Update scrape log
      scrapeLog.status = itemsAdded > 0 ? "success" : "partial";
      scrapeLog.message = `Scraped ${scrapedData.length} items, added ${itemsAdded}, updated ${itemsUpdated}`;
      scrapeLog.itemsSaved = itemsAdded;
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
    } catch (dbError) {
      console.warn("⚠️ Database save failed, returning scraped data anyway:", dbError);
      return NextResponse.json(
        {
          success: true,
          message: "Scraper completed (DB save failed)",
          stats: {
            itemsScraped: scrapedData.length,
            itemsAdded: 0,
            itemsUpdated: 0,
          },
          data: scrapedData,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("❌ Scraper error:", errorMessage);
    console.error("Stack:", errorStack);

    return NextResponse.json(
      {
        error: "Scraper failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

