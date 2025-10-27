import mongoose, { Schema, models, Document } from "mongoose";

export interface IScrapeLog extends Document {
  platform: "OLX" | "PriceOye" | "All";
  status: "success" | "error" | "partial";
  message: string;
  itemsScraped?: number;
  itemsSaved?: number;
  duration?: number; // in milliseconds
  error?: string;
  timestamp: Date;
}

const ScrapeLogSchema = new Schema<IScrapeLog>(
  {
    platform: {
      type: String,
      enum: ["OLX", "PriceOye", "All"],
      required: [true, "Platform is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["success", "error", "partial"],
      default: "success",
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    itemsScraped: {
      type: Number,
      default: 0,
      min: 0,
    },
    itemsSaved: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: null, // in milliseconds
      min: 0,
    },
    error: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 2592000, // Auto-delete after 30 days
    },
  },
  {
    timestamps: false, // We use timestamp field instead
  }
);

// Index for recent scrapes
ScrapeLogSchema.index({ platform: 1, timestamp: -1 });
ScrapeLogSchema.index({ status: 1, timestamp: -1 });

export const ScrapeLog =
  models.ScrapeLog || mongoose.model<IScrapeLog>("ScrapeLog", ScrapeLogSchema);

