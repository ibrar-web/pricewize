import mongoose, { Schema, models, Document } from "mongoose";

export interface IPlatform extends Document {
  name: "OLX" | "Cashify" | "eBay" | "Other";
  url: string;
  isActive: boolean;
  lastScraped: Date;
  totalListings: number;
  averageResponseTime: number; // in milliseconds
  successRate: number; // percentage
  brands?: string[]; // Array of brands available on this platform
  totalBrands?: number; // Count of unique brands
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSchema = new Schema<IPlatform>(
  {
    name: {
      type: String,
      enum: ["OLX", "Cashify", "eBay", "Other"],
      required: [true, "Platform name is required"],
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, "Platform URL is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastScraped: {
      type: Date,
      default: null,
      index: true,
    },
    totalListings: {
      type: Number,
      default: 0,
      min: [0, "Total listings cannot be negative"],
    },
    averageResponseTime: {
      type: Number,
      default: 0,
      min: [0, "Response time cannot be negative"],
    },
    successRate: {
      type: Number,
      default: 100,
      min: [0, "Success rate cannot be less than 0"],
      max: [100, "Success rate cannot be more than 100"],
    },
    brands: {
      type: [String],
      default: [],
      index: true,
    },
    totalBrands: {
      type: Number,
      default: 0,
      min: [0, "Total brands cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

export const Platform =
  models.Platform || mongoose.model<IPlatform>("Platform", PlatformSchema);

