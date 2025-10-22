import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareTable } from "@/components/device/CompareTable";
import { PriceCard } from "@/components/device/PriceCard";
import { getDeviceComparison } from "@/lib/db";
import { generateMetadata as generateSEOMeta } from "@/lib/seo/generateMeta";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/structuredData";
import { notFound } from "next/navigation";

interface PageProps {
  params: { model: string };
}

export async function generateMetadata({ params }: PageProps) {
  const comparison = await getDeviceComparison(params.model);

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
  const comparison = await getDeviceComparison(params.model);

  if (!comparison) {
    notFound();
  }

  const productSchema = generateProductSchema(comparison);
  const breadcrumbSchema = generateBreadcrumbSchema(comparison.model);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
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
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <span>/</span>
              <a href="/devices" className="hover:text-blue-600">
                Devices
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{comparison.model}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {comparison.model} - Price Comparison
            </h1>
            <p className="text-lg text-gray-600">
              Compare {comparison.totalListings} listings from multiple platforms
            </p>
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

