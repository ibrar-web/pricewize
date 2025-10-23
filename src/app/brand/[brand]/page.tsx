import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandPageContent } from "@/components/brand/BrandPageContent";
import { connectDB } from "@/lib/db";
import { Device } from "@/lib/schema";

export const revalidate = 3600; // ISR: Revalidate every 1 hour

interface BrandPageProps {
  params: Promise<{
    brand: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);
  const capitalizedBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1).toLowerCase();

  return {
    title: `Used ${capitalizedBrand} Devices | Best Prices | PriceWize`,
    description: `Browse and compare used ${capitalizedBrand} devices. Find the best prices for ${capitalizedBrand} phones, laptops, tablets and more across all platforms.`,
    keywords: [
      `used ${capitalizedBrand}`,
      `${capitalizedBrand} devices`,
      `${capitalizedBrand} price comparison`,
      `buy used ${capitalizedBrand}`,
    ],
    openGraph: {
      title: `Used ${capitalizedBrand} Devices | PriceWize`,
      description: `Compare used ${capitalizedBrand} device prices across multiple platforms.`,
      url: `https://pricewize.com/brand/${brand}`,
      siteName: "PriceWize",
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);
  const capitalizedBrand =
    decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1).toLowerCase();

  let deviceCount = 0;
  let categories: string[] = [];

  try {
    await connectDB();

    // Get device count and categories for this brand
    const brandData = await Device.aggregate([
      {
        $match: {
          brand: { $regex: `^${capitalizedBrand}$`, $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalDevices: { $sum: 1 },
          categories: { $addToSet: "$category" },
        },
      },
    ]);

    if (brandData.length > 0) {
      deviceCount = brandData[0].totalDevices;
      categories = brandData[0].categories;
    }
  } catch (error) {
    console.warn("⚠️ Error fetching brand data:", error);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <BrandPageContent
          brand={capitalizedBrand}
          deviceCount={deviceCount}
          categories={categories}
        />
      </main>
      <Footer />
    </>
  );
}

