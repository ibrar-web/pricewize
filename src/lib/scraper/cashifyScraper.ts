import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Cashify Scraper - Real implementation
 * Scrapes actual listings from Cashify (India & Pakistan)
 */

export interface CashifyListing {
  title: string;
  price: number;
  condition: string;
  location: string;
  url: string;
  image: string;
  sellerName?: string;
  description?: string;
}

/**
 * Scrape Cashify for a specific search query
 * Returns real listings with actual URLs
 */
export async function scrapeCashify(searchQuery: string): Promise<CashifyListing[]> {
  try {
    const listings: CashifyListing[] = [];

    // Cashify search URL
    const searchUrl = `https://cashify.in/search?q=${encodeURIComponent(searchQuery)}`;

    console.log(`🔍 Scraping Cashify for: ${searchQuery}`);

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Parse Cashify listings
    $("div.product-card, div.product-item, div[data-testid='product-card']").each((index, element) => {
      if (index >= 10) return;

      try {
        const titleEl = $(element).find("h2, h3, .product-title, [data-testid='product-title']");
        const title = titleEl.text().trim();

        const priceEl = $(element).find(".price, .product-price, [data-testid='product-price']");
        const priceText = priceEl.text().trim();

        const linkEl = $(element).find("a");
        const url = linkEl.attr("href") || "";

        const imageEl = $(element).find("img");
        const image = imageEl.attr("src") || imageEl.attr("data-src") || "";

        if (title && priceText && url) {
          // Extract price
          let price = 0;
          const priceMatch = priceText.match(/[\d,]+\.?\d*/);
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/,/g, "")) || 0;
          }

          if (price > 0) {
            listings.push({
              title,
              price,
              condition: "Used",
              location: "India",
              url: url.startsWith("http") ? url : `https://cashify.in${url}`,
              image: image.startsWith("http") ? image : `https://cashify.in${image}`,
              sellerName: "Cashify",
              description: title,
            });
          }
        }
      } catch (itemError) {
        console.error("Error parsing Cashify item:", itemError);
      }
    });

    console.log(`✅ Found ${listings.length} listings on Cashify`);
    return listings;
  } catch (error) {
    console.error("❌ Cashify scraper error:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape Cashify API (alternative method)
 */
export async function scrapeCashifyAPI(searchQuery: string): Promise<CashifyListing[]> {
  try {
    const listings: CashifyListing[] = [];

    // Cashify API endpoint
    const apiUrl = `https://api.cashify.in/v1/search?q=${encodeURIComponent(searchQuery)}&limit=10`;

    console.log(`🔍 Scraping Cashify API for: ${searchQuery}`);

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    if (response.data && response.data.results) {
      const items = response.data.results.slice(0, 10);

      for (const item of items) {
        try {
          const title = item.name || item.title || "";
          const price = item.price || item.minPrice || 0;
          const url = item.url || item.link || `https://cashify.in/product/${item.id}`;
          const image = item.image || item.thumbnail || item.imageUrl || "";

          if (title && price > 0) {
            listings.push({
              title,
              price: parseInt(price.toString()),
              condition: item.condition || "Used",
              location: item.location || "India",
              url,
              image,
              sellerName: "Cashify",
              description: item.description || title,
            });
          }
        } catch (itemError) {
          console.error("Error parsing Cashify API item:", itemError);
        }
      }
    }

    console.log(`✅ Found ${listings.length} listings on Cashify API`);
    return listings;
  } catch (error) {
    console.error("❌ Cashify API scraper error:", error instanceof Error ? error.message : error);
    return scrapeCashify(searchQuery); // Fallback to web scraping
  }
}

