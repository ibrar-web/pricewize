import axios from "axios";
import * as cheerio from "cheerio";

/**
 * OLX Pakistan Scraper - Real implementation
 * Scrapes actual listings from OLX Pakistan
 */

export interface OLXListing {
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
 * Scrape OLX Pakistan for a specific search query
 * Returns real listings with actual URLs
 */
export async function scrapeOLXPakistan(searchQuery: string): Promise<OLXListing[]> {
  try {
    const listings: OLXListing[] = [];

    // OLX Pakistan API endpoint for search
    const searchUrl = `https://www.olx.com.pk/api/v1/search?q=${encodeURIComponent(searchQuery)}&limit=10`;

    console.log(`🔍 Scraping OLX Pakistan for: ${searchQuery}`);

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
      timeout: 15000,
    });

    if (response.data && response.data.data && response.data.data.items) {
      const items = response.data.data.items.slice(0, 10);

      for (const item of items) {
        try {
          const price = item.price || 0;
          const title = item.title || "";
          const url = item.url || `https://www.olx.com.pk${item.link}`;
          const image = item.image?.url || item.thumbnail_url || "";

          if (title && price > 0) {
            listings.push({
              title,
              price: parseInt(price.toString()),
              condition: "Used",
              location: item.location?.name || "Pakistan",
              url,
              image,
              sellerName: item.seller?.name || "OLX Seller",
              description: item.description || title,
            });
          }
        } catch (itemError) {
          console.error("Error parsing OLX item:", itemError);
        }
      }
    }

    console.log(`✅ Found ${listings.length} listings on OLX Pakistan`);
    return listings;
  } catch (error) {
    console.error("❌ OLX Pakistan scraper error:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape OLX Pakistan using web scraping (fallback)
 */
export async function scrapeOLXPakistanWeb(searchQuery: string): Promise<OLXListing[]> {
  try {
    const listings: OLXListing[] = [];

    const searchUrl = `https://www.olx.com.pk/items/q-${encodeURIComponent(searchQuery)}`;

    console.log(`🔍 Web scraping OLX Pakistan for: ${searchQuery}`);

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Parse OLX listings
    $("div[data-testid='listing-item']").each((index, element) => {
      if (index >= 10) return;

      try {
        const titleEl = $(element).find("a[data-testid='listing-title']");
        const title = titleEl.text().trim();
        const url = titleEl.attr("href") || "";

        const priceEl = $(element).find("span[data-testid='listing-price']");
        const priceText = priceEl.text().trim();

        const imageEl = $(element).find("img");
        const image = imageEl.attr("src") || "";

        if (title && priceText && url) {
          const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

          if (price > 0) {
            listings.push({
              title,
              price,
              condition: "Used",
              location: "Pakistan",
              url: url.startsWith("http") ? url : `https://www.olx.com.pk${url}`,
              image,
              sellerName: "OLX Seller",
              description: title,
            });
          }
        }
      } catch (itemError) {
        console.error("Error parsing OLX item:", itemError);
      }
    });

    console.log(`✅ Found ${listings.length} listings on OLX Pakistan (web)`);
    return listings;
  } catch (error) {
    console.error("❌ OLX Pakistan web scraper error:", error instanceof Error ? error.message : error);
    return [];
  }
}

