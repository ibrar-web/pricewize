import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/components/home/HomeContent";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";

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

async function getTrendingDevices() {
  try {
    await connectDB();

    // Get all devices as plain objects (not Mongoose documents)
    const devices = await Device.find().lean().limit(100);
 
    if (devices.length === 0) {
      return [];
    }

    // For each device, get the lowest price and count listings
    const trendingData = await Promise.all(
      devices.map(async (device) => {
        const prices = await Price.find({ deviceId: device._id })
          .sort({ price: 1 })
          .lean();

        if (prices.length === 0) {
          return null;
        }

        const lowestPrice = prices[0].price;
        const totalListings = prices.length;

        return {
          id: String(device._id),
          name: device.name,
          brand: device.brand,
          slug: device.modelSlug,
          image: device.image,
          lowestPrice,
          searches: totalListings * 10,
        };
      })
    );

    // Filter out null values and sort by total listings (popularity)
    return trendingData
      .filter((item) => item !== null)
      .sort((a, b) => (b?.searches || 0) - (a?.searches || 0))
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch trending devices:", error);
    return [];
  }
}

export default async function Home() {
  const trendingDevices = await getTrendingDevices();

  return (
    <>
      <Header />
      <HomeContent initialTrendingDevices={trendingDevices} />
      <Footer />
    </>
  );
}
