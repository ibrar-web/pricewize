import { connectDB } from "@/lib/db";
import { Device } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pricewize.com";

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export async function generateSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Add home page
  entries.push({
    url: SITE_URL,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "daily",
    priority: 1.0,
  });

  try {
    // Get all devices
    await connectDB();
    const devices = await Device.find({}).select("modelSlug lastUpdated");

    // Add device pages
    devices.forEach((device) => {
      entries.push({
        url: `${SITE_URL}/devices/${device.modelSlug}`,
        lastmod: device.lastUpdated.toISOString().split("T")[0],
        changefreq: "daily",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("Error generating sitemap entries:", error);
  }

  return entries;
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return xml;
}

export function generateRobotsText(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

