const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pricewize";

const deviceSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  modelSlug: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const priceSchema = new mongoose.Schema({
  deviceId: mongoose.Schema.Types.ObjectId,
  platform: String,
  price: Number,
  condition: String,
  location: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Device = mongoose.model("Device", deviceSchema);
const Price = mongoose.model("Price", priceSchema);

// Real device data with proper images
const devices = [
  // Phones
  { name: "iPhone 15 Pro", brand: "Apple", category: "phone", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop", desc: "Latest Apple flagship" },
  { name: "iPhone 15", brand: "Apple", category: "phone", image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", desc: "Apple iPhone 15" },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "phone", image: "https://images.unsplash.com/photo-1511454612769-582b42cd8d40?w=400&h=400&fit=crop", desc: "Samsung flagship" },
  { name: "Google Pixel 8", brand: "Google", category: "phone", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop", desc: "Google Pixel" },
  { name: "OnePlus 12", brand: "OnePlus", category: "phone", image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", desc: "OnePlus flagship" },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "phone", image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", desc: "Xiaomi phone" },
  
  // Laptops
  { name: "MacBook Pro 16", brand: "Apple", category: "laptop", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", desc: "Apple MacBook Pro" },
  { name: "Dell XPS 15", brand: "Dell", category: "laptop", image: "https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop", desc: "Dell XPS laptop" },
  { name: "HP Pavilion 15", brand: "HP", category: "laptop", image: "https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop", desc: "HP Pavilion" },
  { name: "Lenovo ThinkPad", brand: "Lenovo", category: "laptop", image: "https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop", desc: "Lenovo ThinkPad" },
  
  // Tablets
  { name: "iPad Pro 12.9", brand: "Apple", category: "tablet", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop", desc: "Apple iPad Pro" },
  { name: "Samsung Galaxy Tab S9", brand: "Samsung", category: "tablet", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop", desc: "Samsung tablet" },
  
  // Smartwatches
  { name: "Apple Watch Series 9", brand: "Apple", category: "smartwatch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", desc: "Apple Watch" },
  { name: "Samsung Galaxy Watch 6", brand: "Samsung", category: "smartwatch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", desc: "Samsung Watch" },
];

const platforms = ["OLX", "Cashify", "eBay", "Other"];
const locations = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan"];
const conditions = ["Excellent", "Good", "Fair", "Poor"];

async function populateDevices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Device.deleteMany({});
    await Price.deleteMany({});
    await Device.collection.dropIndexes().catch(() => {});
    await Price.collection.dropIndexes().catch(() => {});
    console.log("✅ Cleared existing data");

    // Generate 1000 devices
    const deviceBatch = [];
    for (let i = 0; i < 1000; i++) {
      const baseDevice = devices[i % devices.length];
      const variant = Math.floor(i / devices.length) + 1;
      
      deviceBatch.push({
        name: `${baseDevice.name}${variant > 1 ? ` (v${variant})` : ""}`,
        brand: baseDevice.brand,
        category: baseDevice.category,
        modelSlug: `${baseDevice.name.toLowerCase().replace(/\s+/g, "-")}-${variant}`,
        image: baseDevice.image,
        description: baseDevice.desc,
      });
    }

    const insertedDevices = await Device.insertMany(deviceBatch, { ordered: false });
    console.log(`✅ Inserted ${insertedDevices.length} devices`);

    // Generate prices
    const priceBatch = [];
    const priceRanges = {
      phone: { min: 15000, max: 150000 },
      laptop: { min: 50000, max: 300000 },
      tablet: { min: 25000, max: 100000 },
      smartwatch: { min: 10000, max: 50000 },
    };

    for (const device of insertedDevices) {
      const range = priceRanges[device.category];
      const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);

      for (const platform of platforms) {
        const variation = Math.floor(Math.random() * 20000) - 10000;
        const location = locations[Math.floor(Math.random() * locations.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        priceBatch.push({
          deviceId: device._id,
          platform,
          price: Math.max(basePrice + variation, range.min),
          condition,
          location,
          url: `https://${platform.toLowerCase()}.com/device/${device.modelSlug}`,
        });
      }
    }

    const insertedPrices = await Price.insertMany(priceBatch, { ordered: false });
    console.log(`✅ Inserted ${insertedPrices.length} prices`);

    console.log("\n✅ Database populated successfully!");
    console.log(`Total Devices: ${insertedDevices.length}`);
    console.log(`Total Prices: ${insertedPrices.length}`);
    console.log(`Platforms: ${platforms.join(", ")}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

populateDevices();

