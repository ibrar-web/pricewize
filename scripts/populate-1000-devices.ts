import mongoose from "mongoose";
import { Device, Price } from "../src/lib/schema";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pricewize";

const devices = [
  // Smartphones
  { name: "iPhone 15 Pro", brand: "Apple", category: "smartphones" },
  { name: "iPhone 15", brand: "Apple", category: "smartphones" },
  { name: "iPhone 14 Pro Max", brand: "Apple", category: "smartphones" },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "smartphones" },
  { name: "Samsung Galaxy S23", brand: "Samsung", category: "smartphones" },
  { name: "Samsung Galaxy A54", brand: "Samsung", category: "smartphones" },
  { name: "Google Pixel 8", brand: "Google", category: "smartphones" },
  { name: "Google Pixel 7", brand: "Google", category: "smartphones" },
  { name: "OnePlus 12", brand: "OnePlus", category: "smartphones" },
  { name: "OnePlus 11", brand: "OnePlus", category: "smartphones" },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "smartphones" },
  { name: "Xiaomi 13", brand: "Xiaomi", category: "smartphones" },
  { name: "Oppo Find X7", brand: "Oppo", category: "smartphones" },
  { name: "Vivo X100", brand: "Vivo", category: "smartphones" },
  { name: "Realme 12", brand: "Realme", category: "smartphones" },
  
  // Laptops
  { name: "MacBook Pro 16", brand: "Apple", category: "laptops" },
  { name: "MacBook Air M3", brand: "Apple", category: "laptops" },
  { name: "Dell XPS 15", brand: "Dell", category: "laptops" },
  { name: "Dell XPS 13", brand: "Dell", category: "laptops" },
  { name: "HP Pavilion 15", brand: "HP", category: "laptops" },
  { name: "Lenovo ThinkPad X1", brand: "Lenovo", category: "laptops" },
  { name: "Asus VivoBook 15", brand: "Asus", category: "laptops" },
  { name: "MSI GE76 Raider", brand: "MSI", category: "laptops" },
  { name: "Acer Aspire 5", brand: "Acer", category: "laptops" },
  { name: "HP Envy 13", brand: "HP", category: "laptops" },
  
  // Tablets
  { name: "iPad Pro 12.9", brand: "Apple", category: "tablets" },
  { name: "iPad Air", brand: "Apple", category: "tablets" },
  { name: "iPad Mini", brand: "Apple", category: "tablets" },
  { name: "Samsung Galaxy Tab S9", brand: "Samsung", category: "tablets" },
  { name: "Samsung Galaxy Tab A", brand: "Samsung", category: "tablets" },
  { name: "Lenovo Tab P12", brand: "Lenovo", category: "tablets" },
  { name: "Microsoft Surface Pro", brand: "Microsoft", category: "tablets" },
  
  // Smartwatches
  { name: "Apple Watch Series 9", brand: "Apple", category: "smartwatches" },
  { name: "Apple Watch Ultra", brand: "Apple", category: "smartwatches" },
  { name: "Samsung Galaxy Watch 6", brand: "Samsung", category: "smartwatches" },
  { name: "Garmin Epix", brand: "Garmin", category: "smartwatches" },
];

const platforms = ["olx", "cashify", "ebay", "priceoye"];

async function populateDevices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Device.deleteMany({});
    await Price.deleteMany({});
    console.log("Cleared existing data");

    // Generate 1000 devices
    const deviceBatch = [];
    for (let i = 0; i < 1000; i++) {
      const baseDevice = devices[i % devices.length];
      const variant = Math.floor(i / devices.length) + 1;
      
      deviceBatch.push({
        name: `${baseDevice.name} (Variant ${variant})`,
        brand: baseDevice.brand,
        category: baseDevice.category,
        modelSlug: `${baseDevice.name.toLowerCase().replace(/\s+/g, "-")}-v${variant}`,
        image: `https://via.placeholder.com/300x300?text=${baseDevice.name}`,
      });
    }

    // Insert devices in batches
    const insertedDevices = await Device.insertMany(deviceBatch, { ordered: false });
    console.log(`✅ Inserted ${insertedDevices.length} devices`);

    // Generate prices for each device
    const priceBatch = [];
    const priceRanges = {
      smartphones: { min: 15000, max: 150000 },
      laptops: { min: 50000, max: 300000 },
      tablets: { min: 25000, max: 100000 },
      smartwatches: { min: 10000, max: 50000 },
    };

    for (const device of insertedDevices) {
      const range = priceRanges[device.category as keyof typeof priceRanges];
      const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);

      for (const platform of platforms) {
        const variation = Math.floor(Math.random() * 20000) - 10000; // ±10000
        priceBatch.push({
          deviceId: device._id,
          platform,
          price: Math.max(basePrice + variation, range.min),
          condition: Math.random() > 0.5 ? "used" : "refurbished",
          url: `https://${platform}.com/device/${device.modelSlug}`,
        });
      }
    }

    // Insert prices in batches
    const insertedPrices = await Price.insertMany(priceBatch, { ordered: false });
    console.log(`✅ Inserted ${insertedPrices.length} prices`);

    console.log("\n✅ Database populated successfully!");
    console.log(`Total Devices: ${insertedDevices.length}`);
    console.log(`Total Prices: ${insertedPrices.length}`);
    console.log(`Platforms: ${platforms.join(", ")}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
}

populateDevices();

