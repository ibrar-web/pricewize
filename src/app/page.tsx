import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/components/home/HomeContent";
import { connectDB } from "@/lib/db";
import { getTrendingDevices, getAllLocations } from "@/lib/cache/dataCache";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

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

export default async function Home() {
  await connectDB();

  // Fetch data in parallel for better performance
  const [trendingDevices, locations] = await Promise.all([
    getTrendingDevices(),
    getAllLocations(),
  ]);

  return (
    <>
      <Header />
      <HomeContent
        initialTrendingDevices={trendingDevices}
        initialLocations={locations}
      />
      <Footer />
    </>
  );
}
