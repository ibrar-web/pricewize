import axios from "axios";
import * as cheerio from "cheerio";

/**
 * eBay Scraper - Real implementation
 * Scrapes actual listings from eBay
 */

export interface EBayListing {
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
 * Scrape eBay for a specific search query
 * Returns real listings with actual URLs
 */
export async function scrapeEBay(searchQuery: string): Promise<EBayListing[]> {
  try {
    const listings: EBayListing[] = [];

    // eBay search URL
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&_sop=12&rt=nc`;

    console.log(`🔍 Scraping eBay for: ${searchQuery}`);

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Parse eBay listings
    $("div.s-item").each((index, element) => {
      if (index >= 10) return;

      try {
        const titleEl = $(element).find("span.s-item__title");
        const title = titleEl.text().trim();

        const priceEl = $(element).find("span.s-item__price");
        const priceText = priceEl.text().trim();

        const linkEl = $(element).find("a.s-item__link");
        const url = linkEl.attr("href") || "";

        const imageEl = $(element).find("img.s-item__image");
        const image = imageEl.attr("src") || "";

        if (title && priceText && url) {
          // Extract price (handle different formats)
          let price = 0;
          const priceMatch = priceText.match(/[\d,]+\.?\d*/);
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/,/g, "")) || 0;
          }

          if (price > 0 && !title.includes("Shop on eBay")) {
            listings.push({
              title,
              price,
              condition: "Used",
              location: "USA",
              url,
              image,
              sellerName: "eBay Seller",
              description: title,
            });
          }
        }
      } catch (itemError) {
        console.error("Error parsing eBay item:", itemError);
      }
    });

    console.log(`✅ Found ${listings.length} listings on eBay`);
    return listings;
  } catch (error) {
    console.error("❌ eBay scraper error:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape eBay using API (alternative method)
 */
export async function scrapeEBayAPI(searchQuery: string): Promise<EBayListing[]> {
  try {
    const listings: EBayListing[] = [];

    // eBay API endpoint (requires API key)
    const apiUrl = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${process.env.EBAY_API_KEY}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${encodeURIComponent(searchQuery)}&paginationInput.entriesPerPage=10`;

    console.log(`🔍 Scraping eBay API for: ${searchQuery}`);

    if (!process.env.EBAY_API_KEY) {
      console.warn("⚠️ EBAY_API_KEY not set, using web scraping instead");
      return scrapeEBay(searchQuery);
    }

    const response = await axios.get(apiUrl, {
      timeout: 15000,
    });

    if (response.data && response.data.findItemsByKeywordsResponse) {
      const items = response.data.findItemsByKeywordsResponse[0].searchResult[0].item || [];

      for (const item of items.slice(0, 10)) {
        try {
          const title = item.title?.[0] || "";
          const price = parseInt(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "0") || 0;
          const url = item.viewItemURL?.[0] || "";
          const image = item.galleryURL?.[0] || "";

          if (title && price > 0 && url) {
            listings.push({
              title,
              price,
              condition: "Used",
              location: "USA",
              url,
              image,
              sellerName: "eBay Seller",
              description: title,
            });
          }
        } catch (itemError) {
          console.error("Error parsing eBay API item:", itemError);
        }
      }
    }

    console.log(`✅ Found ${listings.length} listings on eBay API`);
    return listings;
  } catch (error) {
    console.error("❌ eBay API scraper error:", error instanceof Error ? error.message : error);
    return scrapeEBay(searchQuery); // Fallback to web scraping
  }
}

