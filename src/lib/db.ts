import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ibrarjutt1997_db_user:JMWP3VMBUvAYfEtH@pricewize.76r16dx.mongodb.net/pricewize";

if (!MONGODB_URI) {
  throw new Error("⚠️ MongoDB URI not defined in environment variables");
}

interface CachedConnection {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  var mongooseCache: CachedConnection;
}

let cached: CachedConnection = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB
 * Uses connection caching to avoid multiple connections in serverless environments
 */
export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "pricewize",
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    console.log("🔌 Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
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

/**
 * Disconnect from MongoDB
 * Useful for cleanup in tests or graceful shutdown
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("✅ MongoDB disconnected");
  }
}

/**
 * Database Utilities
 * Import models from @/lib/schema for all database operations
 */

export { Device, Price, ScrapeLog, PriceHistory, Platform, User } from "@/lib/schema";

