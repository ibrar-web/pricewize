import mongoose, { Schema, models, Document } from "mongoose";

export interface IPriceHistory extends Document {
  deviceId: mongoose.Types.ObjectId;
  platform: "OLX" | "Cashify" | "eBay" | "Other";
  price: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  location: string;
  timestamp: Date;
  createdAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>(
  {
    deviceId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "Device ID is required"],
      index: true,
    },
    platform: {
      type: String,
      enum: ["OLX", "Cashify", "eBay", "Other"],
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
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 7776000, // Auto-delete after 90 days
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PriceHistorySchema.index({ deviceId: 1, platform: 1, timestamp: -1 });
PriceHistorySchema.index({ deviceId: 1, timestamp: -1 });
PriceHistorySchema.index({ platform: 1, timestamp: -1 });

export const PriceHistory =
  models.PriceHistory ||
  mongoose.model<IPriceHistory>("PriceHistory", PriceHistorySchema);

