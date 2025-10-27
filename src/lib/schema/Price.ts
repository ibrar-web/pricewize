import mongoose, { Schema, models, Document } from "mongoose";

export interface IPrice extends Document {
  deviceId: mongoose.Types.ObjectId;
  platform: "OLX" | "PriceOye" | "Other";
  price: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  location: string;
  sellerName?: string;
  url: string;
  description?: string;
  images?: string[];
  brand?: string;
  lastScraped: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PriceSchema = new Schema<IPrice>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "Device ID is required"],
      index: true,
    },
    platform: {
      type: String,
      enum: ["OLX", "PriceOye", "Other"],
      required: [true, "Platform is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Good",
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    sellerName: {
      type: String,
      trim: true,
      default: null,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    lastScraped: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PriceSchema.index({ deviceId: 1, platform: 1 });
PriceSchema.index({ deviceId: 1, price: 1 });
PriceSchema.index({ platform: 1, lastScraped: -1 });
PriceSchema.index({ lastScraped: -1 }); // For cleanup queries

export const Price =
  models.Price || mongoose.model<IPrice>("Price", PriceSchema);

