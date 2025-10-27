import { chromium } from "playwright";

export interface PriceOyeListing {
  title: string;
  price: number;
  condition: string;
  location: string;
  url: string;
  image: string;
  images?: string[];
  sellerName?: string;
  description?: string;
}

/**
 * Scrape PriceOye Pakistan using Playwright for server-side rendering
 * Handles JavaScript-rendered content and dynamic listings
 */
export async function scrapePriceOyePakistanWeb(
  searchQuery: string
): Promise<PriceOyeListing[]> {
  let browser = null;
  try {
    const listings: PriceOyeListing[] = [];
    const searchUrl = `https://priceoye.pk/mobiles/${encodeURIComponent(
      searchQuery.toLowerCase()
    )}`;

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

    // Wait for products to render
    console.log("⏳ Waiting for products to render...");
    try {
      await page.waitForSelector(".productBox", { timeout: 20000 });
    } catch {
      console.log("⚠️  Products not found, trying to extract anyway...");
    }

    // Extract listings using page.$$eval
    const listings_data = await page.$$eval(".productBox", (products) =>
      products.slice(0, 20).map((product) => {
        try {
          // Extract title from p-title
          const titleElement = product.querySelector(".p-title");
          const title = titleElement?.textContent?.trim() || "";

          // Extract price - look for price-box
          let priceText = "";
          const priceElement = product.querySelector(".price-box span");
          if (priceElement) {
            priceText = priceElement.textContent?.trim() || "";
          }

          // Extract URL from link
          const linkElement = product.querySelector("a") as HTMLAnchorElement;
          const url = linkElement?.href || "";

          // Extract image
          const imgElement = product.querySelector(".product-thumbnail-img") as HTMLImageElement;
          const image = imgElement
            ? imgElement.src || imgElement.getAttribute("data-src") || ""
            : "";

          return {
            title,
            priceText,
            url,
            image,
          };
        } catch (e) {
          console.error("Error extracting product data:", e);
          return null;
        }
      })
    );

    // Process extracted data
    for (const item of listings_data) {
      if (!item) continue;

      try {
        const { title, priceText, url, image } = item;

        // Parse price - extract numbers only, handle "Rs" prefix
        let price = 0;
        if (priceText) {
          // Remove "Rs" and extract numbers
          const priceMatch = priceText.match(/[\d,]+/);
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/,/g, "")) || 0;
          }
        }

        // Only add if we have essential data
        if (title && price > 0 && url && image) {
          listings.push({
            title,
            price,
            condition: "New",
            location: "Pakistan",
            url,
            image,
            images: [image],
            sellerName: "PriceOye",
            description: title,
          });
          console.log(`✅ Found: ${title} - PKR ${price}`);
          console.log(`   Image: ${image}`);
          console.log(`   URL: ${url}`);
        }
      } catch (itemError) {
        console.error("Error processing PriceOye item:", itemError);
      }
    }

    console.log(`✅ Found ${listings.length} listings on PriceOye Pakistan`);
    return listings;
  } catch (error) {
    console.error(
      "❌ PriceOye scraper error:",
      error instanceof Error ? error.message : error
    );
    return [];
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
      console.log("🔒 Browser closed");
    }
  }
}

export async function scrapePriceOyePakistan(
  searchQuery: string
): Promise<PriceOyeListing[]> {
  return scrapePriceOyePakistanWeb(searchQuery);
}

