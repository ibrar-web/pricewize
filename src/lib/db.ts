import mongoose from "mongoose";
import { DeviceListing } from "@/types/device";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Device Schema
const deviceSchema = new mongoose.Schema(
  {
    model: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    condition: { type: String, enum: ["Excellent", "Good", "Fair", "Poor"] },
    location: String,
    platform: {
      type: String,
      enum: ["OLX", "Cashify", "eBay", "Other"],
      required: true,
    },
    url: { type: String, required: true, unique: true },
    sellerName: String,
    description: String,
    images: [String],
  },
  { timestamps: true }
);

// Create or get model
export const Device =
  mongoose.models.Device || mongoose.model("Device", deviceSchema);

// Database operations
export async function getDeviceData(model: string): Promise<DeviceListing[]> {
  await connectDB();
  const normalizedModel = model.replace(/-/g, " ");
  return Device.find({
    model: { $regex: normalizedModel, $options: "i" },
  }).sort({ price: 1 });
}

export async function getDeviceComparison(model: string) {
  await connectDB();
  const normalizedModel = model.replace(/-/g, " ");
  const listings = await Device.find({
    model: { $regex: normalizedModel, $options: "i" },
  }).sort({ price: 1 });

  if (listings.length === 0) {
    return null;
  }

  const prices = listings.map((l) => l.price);
  return {
    model: normalizedModel,
    listings,
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    totalListings: listings.length,
  };
}

export async function saveDeviceListing(data: DeviceListing) {
  await connectDB();
  return Device.findOneAndUpdate({ url: data.url }, data, {
    upsert: true,
    new: true,
  });
}

export async function getAllDevices() {
  await connectDB();
  return Device.find({}).sort({ createdAt: -1 }).limit(100);
}

export async function clearOldListings(daysOld: number = 30) {
  await connectDB();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  return Device.deleteMany({ updatedAt: { $lt: cutoffDate } });
}

declare global {
  var mongoose: any;
}

