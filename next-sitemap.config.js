/**
 * Next Sitemap Configuration
 * Generates sitemap.xml and robots.txt for SEO
 */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/api/*", "/admin/*", "/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com"}/sitemap.xml`,
    ],
  },
  additionalPaths: async (config) => {
    const result = [];

    // Add home page
    result.push({
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    // Add devices page
    result.push({
      loc: "/devices",
      changefreq: "daily",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    return result;
  },
};

