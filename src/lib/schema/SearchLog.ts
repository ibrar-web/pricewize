import mongoose from "mongoose";

const SearchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: [true, "Search query is required"],
      index: true,
    },
    results: {
      type: Number,
      default: 0,
    },
    platform: {
      type: String,
      enum: ["olx", "cashify", "ebay", "priceoye", "all"],
      default: "all",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    scraperTriggered: {
      type: Boolean,
      default: false,
    },
    scraperStatus: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 30 * 24 * 60 * 60, // Auto-delete after 30 days
    },
  },
  { timestamps: true }
);

// Index for analytics queries
SearchLogSchema.index({ createdAt: -1, platform: 1 });
SearchLogSchema.index({ query: 1, createdAt: -1 });

export const SearchLog = mongoose.models.SearchLog || mongoose.model("SearchLog", SearchLogSchema);

