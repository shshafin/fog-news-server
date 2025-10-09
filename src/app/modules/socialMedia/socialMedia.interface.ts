import { Model } from "mongoose";

// Define the interface for the SocialMedia data
export interface ISocialMedia {
  title: string;
  videoId: string;
  isActive: boolean;
}

// Define the type for the Mongoose model
export type ISocialMediaModel = Model<ISocialMedia>;
