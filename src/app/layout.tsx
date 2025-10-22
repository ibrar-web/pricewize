import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriceWize - Compare Used Device Prices",
  description:
    "Find the smartest deals on used devices. Compare prices from OLX, Cashify, eBay and more.",
  keywords: [
    "used devices",
    "price comparison",
    "used phones",
    "used laptops",
  ],
  openGraph: {
    title: "PriceWize - Find the Smartest Deals on Used Devices",
    description:
      "Compare used device prices across multiple platforms instantly.",
    url: "https://pricewize.com",
    siteName: "PriceWize",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
