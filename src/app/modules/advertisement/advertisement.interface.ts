import { Document, Model } from "mongoose";

// Advertisement status types
export type AdvertisementStatus =
  | "active"
  | "inactive"
  | "pending"
  | "rejected"
  | "expired";

// Advertisement types
export type AdvertisementType =
  | "banner"
  | "sidebar"
  | "popup"
  | "inline"
  | "sponsored";

export type AdvertisementTarget = "_blank" | "_self" | "_parent" | "_top";

export interface IAdvertisement extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  target?: AdvertisementTarget;
  type: AdvertisementType;
  status: AdvertisementStatus;
  startDate: Date;
  endDate: Date;
  priority: number; // For ordering ads (higher priority shows first)
}

export type IAdvertisementModel = Model<
  IAdvertisement,
  Record<string, unknown>
>;
