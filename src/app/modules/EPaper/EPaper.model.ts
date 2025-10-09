import { model, Schema } from "mongoose";
import { IEpaper, IEpaperModel } from "./EPaper.interface";

const EpaperSchema = new Schema<IEpaper, IEpaperModel>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    file: { type: String, required: true },
    thumbnail: { type: String },
    edition: { type: String },
    category: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Epaper = model<IEpaper, IEpaperModel>("Epaper", EpaperSchema);
