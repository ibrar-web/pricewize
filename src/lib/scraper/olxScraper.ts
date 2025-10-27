import { chromium } from "playwright";

export interface OLXListing {
  title: string;
  price: number;
  condition: string;
  listingType: "New" | "Used" | "Refurbished" | "Unknown";
  location: string;
  url: string;
  image: string;
  images?: string[];
  sellerName?: string;
  description?: string;
}

/**
 * Scrape OLX Pakistan using Playwright for server-side rendering
 * Handles JavaScript-rendered content and dynamic listings
 */
export async function scrapeOLXPakistanWeb(searchQuery: string): Promise<OLXListing[]> {
  let browser = null;
  try {
    const listings: OLXListing[] = [];
    const searchUrl = `https://www.olx.com.pk/mobile-phones_c1453/q-${encodeURIComponent(searchQuery)}`;

    console.log(`📡 Launching Playwright browser for: ${searchUrl}`);

    // Launch browser
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log(`🔍 Navigating to ${searchUrl}`);
    try {
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    } catch {
      console.log("⚠️  Navigation timeout, continuing anyway...");
    }

    // Wait for listings to render
    console.log("⏳ Waiting for listings to render...");
    try {
      await page.waitForSelector("article", { timeout: 20000 });
    } catch {
      console.log("⚠️  Listings not found, trying to extract anyway...");
    }

    // Extract listings using page.$$eval
    const listings_data = await page.$$eval("article", (articles) =>
      articles.slice(0, 20).map((article) => {
        try {
          // Extract title from h2 tag
          const title = article.querySelector("h2")?.textContent?.trim() || "";

          // Extract price - try multiple selectors
          let priceText = "";

          // Try aria-label first
          const priceByLabel = article.querySelector("span[aria-label='Price']");
          if (priceByLabel) {
            priceText = priceByLabel.textContent?.trim() || "";
          }

          // If not found, try to find any span with price-like content
          if (!priceText) {
            const allSpans = article.querySelectorAll("span");
            for (const span of allSpans) {
              const text = span.textContent?.trim() || "";
              // Look for price patterns (numbers with commas or "Lac")
              if (/[\d,]+|lac/i.test(text) && text.length < 50) {
                priceText = text;
                break;
              }
            }
          }

          // Extract URL from link
          const urlElement = article.querySelector("a[href*='/item/']") as HTMLAnchorElement;
          const url = urlElement?.href || "";

          // Extract image
          const imgElement = article.querySelector("img") as HTMLImageElement;
          const image = imgElement
            ? imgElement.src || imgElement.getAttribute("data-src") || ""
            : "";

          // Extract location
          const locationText =
            article.querySelector("span[aria-label='Location']")?.textContent?.trim() || "";
          const location = locationText.split("•")[0].trim();

          return {
            title,
            priceText,
            url,
            image,
            location,
          };
        } catch (e) {
          console.error("Error extracting article data:", e);
          return null;
        }
      })
    );

    // Process extracted data
    for (const item of listings_data) {
      if (!item) continue;

      try {
        const { title, priceText, url, image, location } = item;

        // Parse price - extract numbers only, handle "Rs" prefix and "Lac" suffix
        let price = 0;
        if (priceText) {
          // Handle "Lac" (100,000)
          if (priceText.toLowerCase().includes("lac")) {
            const lacMatch = priceText.match(/[\d.]+/);
            if (lacMatch) {
              price = Math.round(parseFloat(lacMatch[0]) * 100000);
            }
          } else {
            // Regular price - extract numbers only
            const priceMatch = priceText.match(/[\d,]+/);
            if (priceMatch) {
              price = parseInt(priceMatch[0].replace(/,/g, "")) || 0;
            }
          }
        }

        // Only add if we have essential data
        if (title && price > 0 && url && image) {
          listings.push({
            title,
            price,
            condition: "Good",
            listingType: "Used", // OLX is primarily for used items
            location: location || "Pakistan",
            url,
            image,
            images: [image],
            sellerName: "OLX Seller",
            description: title,
          });
          console.log(`✅ Found: ${title} - PKR ${price}`);
          console.log(`   Image: ${image}`);
          console.log(`   URL: ${url}`);
        }
      } catch (itemError) {
        console.error("Error processing OLX item:", itemError);
      }
    }

    console.log(`✅ Found ${listings.length} listings on OLX Pakistan`);
    return listings;
  } catch (error) {
    console.error("❌ OLX scraper error:", error instanceof Error ? error.message : error);
    return [];
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("🔒 Browser closed");
    }
  }
}

export async function scrapeOLXPakistan(searchQuery: string): Promise<OLXListing[]> {
  return scrapeOLXPakistanWeb(searchQuery);
}
