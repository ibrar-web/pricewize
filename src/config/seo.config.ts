/**
 * SEO Configuration
 * Centralized SEO settings for PriceWize
 */

export const seoConfig = {
  // Site Information
  site: {
    name: "PriceWize",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com",
    description: "Find the smartest deals on used devices",
    language: "en",
    locale: "en_US",
  },

  // Social Media
  social: {
    twitter: "@pricewize",
    facebook: "pricewize",
    instagram: "pricewize",
    linkedin: "pricewize",
  },

  // Contact
  contact: {
    email: "support@pricewize.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
  },

  // SEO Keywords
  keywords: {
    primary: [
      "used devices",
      "price comparison",
      "used phones",
      "used laptops",
      "used tablets",
    ],
    secondary: [
      "OLX",
      "Cashify",
      "eBay",
      "device deals",
      "best prices",
      "price aggregator",
    ],
  },

  // Robots Configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Sitemap Configuration
  sitemap: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    changefreq: "daily",
    priority: 0.7,
    exclude: ["/api/*", "/admin/*", "/404", "/500"],
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PriceWize",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com"}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PriceWize - Compare Used Device Prices",
      },
    ],
  },

  // Twitter Card
  twitter: {
    handle: "@pricewize",
    site: "@pricewize",
    cardType: "summary_large_image",
  },

  // Structured Data
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PriceWize",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com"}/logo.png`,
      description: "Find the smartest deals on used devices",
      sameAs: [
        "https://twitter.com/pricewize",
        "https://facebook.com/pricewize",
        "https://instagram.com/pricewize",
      ],
    },
  },
};

export default seoConfig;

