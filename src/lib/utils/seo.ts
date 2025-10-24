import { Metadata } from "next";

export function generateDeviceMetadata(device: {
  name: string;
  brand: string;
  category: string;
  modelSlug: string;
  lowestPrice?: number;
}): Metadata {
  const title = `${device.name} - Used Price Comparison | PriceWize`;
  const description = `Compare prices for ${device.name} across OLX, Cashify, eBay, and PriceOye. Find the best deals on used ${device.brand} ${device.category}.`;
  const url = `https://pricewize.com/devices/${device.modelSlug}`;

  return {
    title,
    description,
    keywords: [
      device.name,
      device.brand,
      device.category,
      "used price",
      "price comparison",
      "buy used",
      "Pakistan",
    ],
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `https://pricewize.com/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: device.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://pricewize.com/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateCategoryMetadata(category: string): Metadata {
  const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Prices | PriceWize`;
  const description = `Compare prices for ${category} across multiple platforms. Find the best deals on used ${category} in Pakistan.`;
  const url = `https://pricewize.com/category/${category}`;

  return {
    title,
    description,
    keywords: [category, "price comparison", "used", "Pakistan"],
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateJsonLd(type: string, data: any) {
  const baseUrl = "https://pricewize.com";

  switch (type) {
    case "device":
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        brand: {
          "@type": "Brand",
          name: data.brand,
        },
        category: data.category,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "PKR",
          lowPrice: data.lowestPrice,
          highPrice: data.highestPrice,
          offerCount: data.offerCount,
        },
        url: `${baseUrl}/devices/${data.modelSlug}`,
      };

    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PriceWize",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: "Compare used device prices across multiple platforms",
        sameAs: [
          "https://twitter.com/pricewize",
          "https://facebook.com/pricewize",
        ],
      };

    case "breadcrumb":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`,
        })),
      };

    default:
      return null;
  }
}

export const SITE_CONFIG = {
  name: "PriceWize",
  description: "Compare used device prices across multiple platforms in Pakistan",
  url: "https://pricewize.com",
  ogImage: "https://pricewize.com/og-image.jpg",
  twitterHandle: "@pricewize",
  email: "support@pricewize.com",
};

