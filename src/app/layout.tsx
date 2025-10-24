import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebsiteSchema, FAQSchema } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriceWize - Compare Used Device Prices | Best Deals Online",
  description:
    "Find the smartest deals on used devices. Compare prices from OLX, Cashify, eBay and more. Get real-time price comparisons for used phones, laptops, tablets and electronics.",
  keywords: [
    "used devices",
    "price comparison",
    "used phones",
    "used laptops",
    "used tablets",
    "device marketplace",
    "best deals",
    "price comparison tool",
    "OLX",
    "Cashify",
    "eBay",
  ],
  openGraph: {
    title: "PriceWize - Find the Smartest Deals on Used Devices",
    description:
      "Compare used device prices across multiple platforms instantly.",
    url: "https://pricewize-steel.vercel.app",
    siteName: "PriceWize",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PriceWize - Compare Used Device Prices",
    description: "Find the best deals on used devices across multiple platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://pricewize-steel.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <WebsiteSchema />
        <FAQSchema />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://pricewize-steel.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
