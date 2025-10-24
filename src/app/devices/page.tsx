import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DevicesContent } from "@/components/devices/DevicesContent";

export const metadata: Metadata = {
  title: "Browse All Used Devices | Price Comparison | PriceWize",
  description:
    "Browse thousands of used devices with real-time price comparison. Find the best deals on used phones, laptops, tablets, and more from OLX, Cashify, eBay and other platforms.",
  keywords: [
    "used devices",
    "price comparison",
    "used phones",
    "used laptops",
    "used tablets",
    "device marketplace",
    "best deals",
    "price comparison tool",
  ],
  openGraph: {
    title: "Browse All Used Devices | PriceWize",
    description:
      "Compare prices of used devices across multiple platforms instantly.",
    url: "https://pricewize-steel.vercel.app/devices",
    siteName: "PriceWize",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Used Devices | PriceWize",
    description: "Compare prices of used devices across multiple platforms.",
  },
};

export default function DevicesPage() {
  return (
    <>
      <Header />
      <DevicesContent />
      <Footer />
    </>
  );
}

