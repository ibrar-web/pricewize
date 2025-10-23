import mongoose from "mongoose";
import { Device, Price } from "../src/lib/schema";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pricewize";

const DEVICES_DATA = [
  // Smartphones
  { name: "iPhone 14 Pro", brand: "Apple", category: "smartphone", modelSlug: "iphone-14-pro" },
  { name: "iPhone 14", brand: "Apple", category: "smartphone", modelSlug: "iphone-14" },
  { name: "iPhone 13 Pro", brand: "Apple", category: "smartphone", modelSlug: "iphone-13-pro" },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "smartphone", modelSlug: "samsung-galaxy-s24" },
  { name: "Samsung Galaxy S23", brand: "Samsung", category: "smartphone", modelSlug: "samsung-galaxy-s23" },
  { name: "Samsung Galaxy A54", brand: "Samsung", category: "smartphone", modelSlug: "samsung-galaxy-a54" },
  { name: "Google Pixel 8", brand: "Google", category: "smartphone", modelSlug: "google-pixel-8" },
  { name: "Google Pixel 7", brand: "Google", category: "smartphone", modelSlug: "google-pixel-7" },
  { name: "OnePlus 12", brand: "OnePlus", category: "smartphone", modelSlug: "oneplus-12" },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "smartphone", modelSlug: "xiaomi-14" },

  // Laptops
  { name: "MacBook Pro 16", brand: "Apple", category: "laptop", modelSlug: "macbook-pro-16" },
  { name: "MacBook Pro 14", brand: "Apple", category: "laptop", modelSlug: "macbook-pro-14" },
  { name: "MacBook Air M2", brand: "Apple", category: "laptop", modelSlug: "macbook-air-m2" },
  { name: "Dell XPS 15", brand: "Dell", category: "laptop", modelSlug: "dell-xps-15" },
  { name: "Dell XPS 13", brand: "Dell", category: "laptop", modelSlug: "dell-xps-13" },
  { name: "HP Pavilion 15", brand: "HP", category: "laptop", modelSlug: "hp-pavilion-15" },
  { name: "Lenovo ThinkPad X1", brand: "Lenovo", category: "laptop", modelSlug: "lenovo-thinkpad-x1" },
  { name: "ASUS VivoBook 15", brand: "ASUS", category: "laptop", modelSlug: "asus-vivobook-15" },
  { name: "MSI GE76 Raider", brand: "MSI", category: "laptop", modelSlug: "msi-ge76-raider" },
  { name: "Razer Blade 15", brand: "Razer", category: "laptop", modelSlug: "razer-blade-15" },

  // Tablets
  { name: "iPad Pro 12.9", brand: "Apple", category: "tablet", modelSlug: "ipad-pro-12-9" },
  { name: "iPad Air", brand: "Apple", category: "tablet", modelSlug: "ipad-air" },
  { name: "iPad Mini", brand: "Apple", category: "tablet", modelSlug: "ipad-mini" },
  { name: "Samsung Galaxy Tab S9", brand: "Samsung", category: "tablet", modelSlug: "samsung-galaxy-tab-s9" },
  { name: "Samsung Galaxy Tab A", brand: "Samsung", category: "tablet", modelSlug: "samsung-galaxy-tab-a" },
  { name: "Microsoft Surface Pro 9", brand: "Microsoft", category: "tablet", modelSlug: "microsoft-surface-pro-9" },
  { name: "Lenovo Tab P12", brand: "Lenovo", category: "tablet", modelSlug: "lenovo-tab-p12" },
  { name: "OnePlus Pad", brand: "OnePlus", category: "tablet", modelSlug: "oneplus-pad" },
  { name: "Google Pixel Tablet", brand: "Google", category: "tablet", modelSlug: "google-pixel-tablet" },
  { name: "Amazon Fire HD 10", brand: "Amazon", category: "tablet", modelSlug: "amazon-fire-hd-10" },

  // Smartwatches
  { name: "Apple Watch Series 9", brand: "Apple", category: "smartwatch", modelSlug: "apple-watch-series-9" },
  { name: "Apple Watch Ultra", brand: "Apple", category: "smartwatch", modelSlug: "apple-watch-ultra" },
  { name: "Samsung Galaxy Watch 6", brand: "Samsung", category: "smartwatch", modelSlug: "samsung-galaxy-watch-6" },
  { name: "Garmin Fenix 7", brand: "Garmin", category: "smartwatch", modelSlug: "garmin-fenix-7" },
  { name: "Fitbit Sense 2", brand: "Fitbit", category: "smartwatch", modelSlug: "fitbit-sense-2" },
];

const PLATFORMS = ["olx", "cashify", "ebay", "priceoye"];

function getRandomPrice(category: string): number {
  const priceRanges: { [key: string]: [number, number] } = {
    smartphone: [30000, 150000],
    laptop: [50000, 300000],
    tablet: [25000, 100000],
    smartwatch: [10000, 50000],
  };

  const [min, max] = priceRanges[category] || [10000, 100000];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function populateData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Device.deleteMany({});
    await Price.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert devices
    const devices = await Device.insertMany(DEVICES_DATA);
    console.log(`✅ Inserted ${devices.length} devices`);

    // Insert prices for each device
    let priceCount = 0;
    for (const device of devices) {
      const platformCount = Math.floor(Math.random() * 3) + 2; // 2-4 platforms per device
      const selectedPlatforms = PLATFORMS.sort(() => Math.random() - 0.5).slice(0, platformCount);

      for (const platform of selectedPlatforms) {
        const price = new Price({
          deviceId: device._id,
          platform,
          price: getRandomPrice(device.category),
          condition: Math.random() > 0.3 ? "used" : "refurbished",
          url: `https://${platform}.com/device/${device.modelSlug}`,
        });
        await price.save();
        priceCount++;
      }
    }

    console.log(`✅ Inserted ${priceCount} prices`);
    console.log("✨ Data population completed successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error populating data:", error);
    process.exit(1);
  }
}

populateData();

