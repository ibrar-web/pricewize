import { ModelSearch } from "@/components/device/ModelSearch";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrendingDown, Zap, Globe, Shield } from "lucide-react";

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
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find the Smartest Deals on Used Devices
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Compare prices from OLX, Cashify, eBay and more. Get the best deal
              on your next used phone, laptop, or tablet.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-16">
            <ModelSearch />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">
                Find the lowest prices across all platforms instantly
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Multiple Platforms
              </h3>
              <p className="text-gray-600 text-sm">
                Compare listings from OLX, Cashify, eBay and more
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Data</h3>
              <p className="text-gray-600 text-sm">
                Prices updated daily with the latest listings
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">
                Direct links to verified sellers on trusted platforms
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Comparing Prices Today
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Save money on your next used device purchase. Compare prices from
              multiple platforms and find the best deal.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Browse Devices
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
