import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata = {
  title: "PriceWize - Compare Used Device Prices | Best Deals",
  description:
    "Find the smartest deals on used devices. Compare prices from OLX, Cashify, eBay and more. Get the best price for your next used phone, laptop, or tablet.",
  keywords: [
    "used devices",
    "price comparison",
    "used phones",
    "used laptops",
    "OLX",
    "Cashify",
    "eBay",
  ],
  openGraph: {
    title: "PriceWize - Find the Smartest Deals on Used Devices",
    description:
      "Compare used device prices across multiple platforms instantly.",
    url: "https://pricewize.com",
    siteName: "PriceWize",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <HomeContent />
      <Footer />
    </>
  );
}
