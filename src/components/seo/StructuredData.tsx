/**
 * Structured Data Component
 * Renders JSON-LD schema for SEO
 */

interface StructuredDataProps {
  schema: Record<string, any>;
}

export function StructuredData({ schema }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema Component
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PriceWize",
    url: "https://pricewize-steel.vercel.app",
    logo: "https://pricewize-steel.vercel.app/og-image.jpg",
    description:
      "PriceWize is a used device price comparison platform that helps you find the best deals on used phones, laptops, tablets and more across multiple marketplaces.",
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

  return <StructuredData schema={schema} />;
}

/**
 * Website Schema Component
 */
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PriceWize",
    url: "https://pricewize-steel.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://pricewize-steel.vercel.app/devices?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    description:
      "Compare used device prices across multiple marketplaces in Pakistan.",
  };

  return <StructuredData schema={schema} />;
}

/**
 * Breadcrumb Schema Component
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://pricewize-steel.vercel.app${item.url}`,
    })),
  };

  return <StructuredData schema={schema} />;
}

/**
 * Product Schema Component
 */
export function ProductSchema({
  device,
}: {
  device: {
    name: string;
    brand: string;
    image?: string;
    lowestPrice?: number;
    description?: string;
    category?: string;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: device.name,
    brand: {
      "@type": "Brand",
      name: device.brand,
    },
    image:
      device.image || "https://pricewize-steel.vercel.app/default-device.png",
    description: device.description || `Used ${device.brand} ${device.name}`,
    category: device.category || "Electronics",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: device.lowestPrice || "0",
      highPrice: device.lowestPrice || "0",
      offerCount: "1",
      availability: "https://schema.org/InStock",
    },
  };

  return <StructuredData schema={schema} />;
}

/**
 * FAQ Schema Component
 */
export function FAQSchema() {
  const schema = {
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
      {
        "@type": "Question",
        name: "Which platforms does PriceWize compare?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We currently compare prices from OLX, Cashify, and eBay. More platforms are being added regularly.",
        },
      },
    ],
  };

  return <StructuredData schema={schema} />;
}

