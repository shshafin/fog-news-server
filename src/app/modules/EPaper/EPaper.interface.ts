// models/Epaper.model.ts
import { Document, Model } from "mongoose";

export interface IEpaper {
  title: string;
  date: Date;
  file: string;
  thumbnail?:string;
  edition?: string; // e.g., "National", "International"
  category?: string; // e.g., "News", "Sports"
  isActive?: boolean;
}

export type IEpaperModel = Model<IEpaper, Record<string, unknown>>;
