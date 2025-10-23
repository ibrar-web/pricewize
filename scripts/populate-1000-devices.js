const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pricewize";

const deviceSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  modelSlug: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const priceSchema = new mongoose.Schema({
  deviceId: mongoose.Schema.Types.ObjectId,
  platform: String,
  price: Number,
  condition: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Device = mongoose.model("Device", deviceSchema);
const Price = mongoose.model("Price", priceSchema);

const devices = [
  // Phones
  { name: "iPhone 15 Pro", brand: "Apple", category: "phone" },
  { name: "iPhone 15", brand: "Apple", category: "phone" },
  { name: "iPhone 14 Pro Max", brand: "Apple", category: "phone" },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "phone" },
  { name: "Samsung Galaxy S23", brand: "Samsung", category: "phone" },
  { name: "Samsung Galaxy A54", brand: "Samsung", category: "phone" },
  { name: "Google Pixel 8", brand: "Google", category: "phone" },
  { name: "Google Pixel 7", brand: "Google", category: "phone" },
  { name: "OnePlus 12", brand: "OnePlus", category: "phone" },
  { name: "OnePlus 11", brand: "OnePlus", category: "phone" },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "phone" },
  { name: "Xiaomi 13", brand: "Xiaomi", category: "phone" },
  { name: "Oppo Find X7", brand: "Oppo", category: "phone" },
  { name: "Vivo X100", brand: "Vivo", category: "phone" },
  { name: "Realme 12", brand: "Realme", category: "phone" },

  // Laptops
  { name: "MacBook Pro 16", brand: "Apple", category: "laptop" },
  { name: "MacBook Air M3", brand: "Apple", category: "laptop" },
  { name: "Dell XPS 15", brand: "Dell", category: "laptop" },
  { name: "Dell XPS 13", brand: "Dell", category: "laptop" },
  { name: "HP Pavilion 15", brand: "HP", category: "laptop" },
  { name: "Lenovo ThinkPad X1", brand: "Lenovo", category: "laptop" },
  { name: "Asus VivoBook 15", brand: "Asus", category: "laptop" },
  { name: "MSI GE76 Raider", brand: "MSI", category: "laptop" },
  { name: "Acer Aspire 5", brand: "Acer", category: "laptop" },
  { name: "HP Envy 13", brand: "HP", category: "laptop" },

  // Tablets
  { name: "iPad Pro 12.9", brand: "Apple", category: "tablet" },
  { name: "iPad Air", brand: "Apple", category: "tablet" },
  { name: "iPad Mini", brand: "Apple", category: "tablet" },
  { name: "Samsung Galaxy Tab S9", brand: "Samsung", category: "tablet" },
  { name: "Samsung Galaxy Tab A", brand: "Samsung", category: "tablet" },
  { name: "Lenovo Tab P12", brand: "Lenovo", category: "tablet" },
  { name: "Microsoft Surface Pro", brand: "Microsoft", category: "tablet" },

  // Smartwatches
  { name: "Apple Watch Series 9", brand: "Apple", category: "smartwatch" },
  { name: "Apple Watch Ultra", brand: "Apple", category: "smartwatch" },
  { name: "Samsung Galaxy Watch 6", brand: "Samsung", category: "smartwatch" },
  { name: "Garmin Epix", brand: "Garmin", category: "smartwatch" },
];

const platforms = ["olx", "cashify", "ebay", "priceoye"];

async function populateDevices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data and drop indexes
    await Device.deleteMany({});
    await Price.deleteMany({});
    await Device.collection.dropIndexes().catch(() => {});
    await Price.collection.dropIndexes().catch(() => {});
    console.log("✅ Cleared existing data and dropped indexes");

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
      phone: { min: 15000, max: 150000 },
      laptop: { min: 50000, max: 300000 },
      tablet: { min: 25000, max: 100000 },
      smartwatch: { min: 10000, max: 50000 },
    };

    const locations = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Faisalabad", "Peshawar"];
    const conditions = ["Excellent", "Good", "Fair", "Poor"];
    const platformMap = { olx: "OLX", cashify: "Cashify", ebay: "eBay", priceoye: "Other" };

    for (const device of insertedDevices) {
      const range = priceRanges[device.category];
      const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);

      for (const platform of platforms) {
        const variation = Math.floor(Math.random() * 20000) - 10000;
        const location = locations[Math.floor(Math.random() * locations.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];

        priceBatch.push({
          deviceId: device._id,
          platform: platformMap[platform],
          price: Math.max(basePrice + variation, range.min),
          condition,
          location,
          url: `https://${platform}.com/device/${device.modelSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating database:", error.message);
    process.exit(1);
  }
}

populateDevices();

