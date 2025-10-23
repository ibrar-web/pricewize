import mongoose, { Schema, models, Document } from "mongoose";

export interface IDevice extends Document {
  name: string;
  brand: string;
  modelSlug: string;
  category: string;
  image?: string;
  images?: string[];
  description?: string;
  lastUpdated: Date;
  createdAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
  {
    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      index: true,
    },
    modelSlug: {
      type: String,
      required: [true, "Model slug is required"],
      unique: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    category: {
      type: String,
      enum: ["phone", "laptop", "tablet", "smartwatch", "other"],
      default: "phone",
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
DeviceSchema.index({ brand: 1, category: 1 });
DeviceSchema.index({ modelSlug: 1, lastUpdated: -1 });

export const Device =
  models.Device || mongoose.model<IDevice>("Device", DeviceSchema);

