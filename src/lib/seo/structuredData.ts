import { DeviceComparison } from "@/types/device";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com";

export function generateProductSchema(comparison: DeviceComparison) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: comparison.model,
    description: `Used ${comparison.model} - Price comparison across multiple platforms`,
    brand: {
      "@type": "Brand",
      name: extractBrand(comparison.model),
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: comparison.lowestPrice,
      highPrice: comparison.highestPrice,
      offerCount: comparison.totalListings,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: comparison.totalListings,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PriceWize",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.jpg`,
    description: "Find the smartest deals on used devices",
    sameAs: [
      "https://twitter.com/pricewize",
      "https://facebook.com/pricewize",
      "https://instagram.com/pricewize",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@pricewize.com",
    },
  };
}

export function generateBreadcrumbSchema(model: string) {
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
        name: model,
        item: `${SITE_URL}/devices/${model.toLowerCase().replace(/\s+/g, "-")}`,
      },
    ],
  };
}

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does PriceWize compare prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PriceWize aggregates listings from multiple platforms like OLX, Cashify, and eBay to show you the best deals on used devices.",
        },
      },
      {
        "@type": "Question",
        name: "Is PriceWize safe to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PriceWize only aggregates public listings. We recommend verifying seller credentials before making purchases.",
        },
      },
      {
        "@type": "Question",
        name: "How often are prices updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prices are updated daily through our automated scraping system.",
        },
      },
    ],
  };
}

function extractBrand(model: string): string {
  const brands = ["iPhone", "Samsung", "OnePlus", "MacBook", "iPad", "Google"];
  for (const brand of brands) {
    if (model.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return "Other";
}

export function generateJSONLD(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

