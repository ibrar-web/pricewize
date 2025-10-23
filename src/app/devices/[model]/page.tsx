import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareTable } from "@/components/device/CompareTable";
import { PriceCard } from "@/components/device/PriceCard";
import { CompareButton } from "@/components/device/CompareButton";
import { connectDB } from "@/lib/db";
import { Device, Price } from "@/lib/schema";
import { generateMetadata as generateSEOMeta } from "@/lib/seo/generateMeta";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/structuredData";
import { notFound } from "next/navigation";
import { mockDevices, mockPrices } from "@/lib/mockData";

interface PageProps {
  params: Promise<{ model: string }>;
}

async function getDeviceComparison(modelSlug: string) {
  const normalizedSlug = modelSlug.toLowerCase().replace(/\s+/g, "-");

  try {
    await connectDB();

    const device = await Device.findOne({
      modelSlug: normalizedSlug,
    });

    if (!device) {
      throw new Error("Device not found in MongoDB");
    }

    const prices = await Price.find({ deviceId: device._id }).sort({
      price: 1,
    });

    if (prices.length === 0) {
      throw new Error("No prices found for device");
    }

    const priceValues = prices.map((p) => p.price);
    return {
      device: {
        id: device._id,
        name: device.name,
        brand: device.brand,
        modelSlug: device.modelSlug,
        category: device.category,
        image: device.image,
      },
      model: device.name,
      listings: prices,
      lowestPrice: Math.min(...priceValues),
      highestPrice: Math.max(...priceValues),
      averagePrice: Math.round(
        priceValues.reduce((a, b) => a + b, 0) / priceValues.length
      ),
      totalListings: prices.length,
    };
  } catch {
    console.warn("⚠️ MongoDB failed, trying mock data for:", normalizedSlug);

    // Fallback to mock data
    const mockDevice = mockDevices.find(
      (d) => d.modelSlug === normalizedSlug
    );

    if (!mockDevice) {
      return null;
    }

    const mockListings = mockPrices.filter(
      (p) => p.deviceId === mockDevice._id
    );

    if (mockListings.length === 0) {
      return null;
    }

    const priceValues = mockListings.map((p) => p.price);
    return {
      device: {
        id: mockDevice._id,
        name: mockDevice.name,
        brand: mockDevice.brand,
        modelSlug: mockDevice.modelSlug,
        category: mockDevice.category,
        image: mockDevice.image,
      },
      model: mockDevice.name,
      listings: mockListings,
      lowestPrice: Math.min(...priceValues),
      highestPrice: Math.max(...priceValues),
      averagePrice: Math.round(
        priceValues.reduce((a, b) => a + b, 0) / priceValues.length
      ),
      totalListings: mockListings.length,
    };
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { model } = await params;
  const comparison = await getDeviceComparison(model);

  if (!comparison) {
    return {
      title: "Device Not Found | PriceWize",
      description: "The device you're looking for is not available.",
    };
  }

  const meta = generateSEOMeta(
    comparison.model,
    comparison.lowestPrice,
    comparison.totalListings
  );

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: meta.canonical,
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.canonical,
      siteName: "PriceWize",
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function DevicePage({ params }: PageProps) {
  const { model } = await params;
  const comparison = await getDeviceComparison(model);

  if (!comparison) {
    notFound();
  }

  const productSchema = generateProductSchema(comparison);
  const breadcrumbSchema = generateBreadcrumbSchema(comparison.model);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-12">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/devices" className="hover:text-blue-600">
                Devices
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{comparison.model}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Device Header with Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Device Image */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
                {comparison.device.image ? (
                  <img
                    src={comparison.device.image}
                    alt={comparison.model}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">Brand</p>
                  <p className="text-lg font-bold text-gray-900">{comparison.device.brand}</p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Category</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">{comparison.device.category}</p>
                </div>
              </div>
            </div>

            {/* Device Info and Stats */}
            <div className="md:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {comparison.model}
                </h1>
                <p className="text-lg text-gray-600">
                  Compare {comparison.totalListings} listings from multiple platforms
                </p>
              </div>

              {/* Price Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Lowest Price</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₨{comparison.lowestPrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Average Price</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₨{comparison.averagePrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">Highest Price</p>
                  <p className="text-2xl font-bold text-red-900">
                    ₨{comparison.highestPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Add to Compare Button */}
              <CompareButton
                deviceId={comparison.device.id}
                deviceName={comparison.model}
                deviceBrand={comparison.device.brand}
                deviceSlug={comparison.device.modelSlug}
                deviceImage={comparison.device.image}
              />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <CompareTable comparison={comparison} />
          </div>

          {/* Individual Listings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparison.listings.map((listing, idx) => (
                <PriceCard key={idx} listing={listing} />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 How PriceWize Works
            </h3>
            <p className="text-blue-800 text-sm">
              We aggregate listings from OLX, Cashify, eBay and other platforms
              to help you find the best deals on used devices. Prices are updated
              daily. Always verify seller credentials before making a purchase.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

