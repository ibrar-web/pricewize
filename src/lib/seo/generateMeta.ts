import { SEOMetadata } from "@/types/device";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com";
const SITE_NAME = "PriceWize";
const DEFAULT_DESCRIPTION =
  "Find the smartest deals on used devices. Compare prices from OLX, Cashify, eBay and more.";

export function generateMetadata(
  model: string,
  lowestPrice?: number,
  totalListings?: number
): SEOMetadata {
  const displayModel = model.replace(/-/g, " ");
  const priceText = lowestPrice ? ` from ₹${lowestPrice.toLocaleString()}` : "";
  const listingText = totalListings ? ` (${totalListings} listings)` : "";

  const title = `${displayModel} Used Price Comparison${priceText} | ${SITE_NAME}`;
  const description = `Compare used ${displayModel} prices across multiple platforms${listingText}. Find the best deals on ${displayModel} with PriceWize.`;
  const canonical = `${SITE_URL}/devices/${model}`;

  return {
    title,
    description,
    keywords: [
      `${displayModel} price`,
      `used ${displayModel}`,
      `${displayModel} comparison`,
      "price comparison",
      "used devices",
    ],
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${SITE_URL}/og-image.jpg`,
  };
}

export function generateHomeMetadata(): SEOMetadata {
  return {
    title: `${SITE_NAME} - Compare Used Device Prices | Best Deals`,
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "used devices",
      "price comparison",
      "used phones",
      "used laptops",
      "OLX",
      "Cashify",
      "eBay",
    ],
    canonical: SITE_URL,
    ogTitle: `${SITE_NAME} - Find the Smartest Deals on Used Devices`,
    ogDescription: DEFAULT_DESCRIPTION,
    ogImage: `${SITE_URL}/og-image.jpg`,
  };
}

export function generateStructuredData(
  model: string,
  lowestPrice: number,
  currency: string = "INR"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model,
    description: `Used ${model} price comparison`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: lowestPrice,
      offerCount: 1,
    },
  };
}

export function generateBreadcrumb(model: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Devices",
        item: `${SITE_URL}/devices`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: model.replace(/-/g, " "),
        item: `${SITE_URL}/devices/${model}`,
      },
    ],
  };
}

