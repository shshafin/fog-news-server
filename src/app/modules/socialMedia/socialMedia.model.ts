import { Schema, model } from "mongoose";
import { ISocialMedia, ISocialMediaModel } from "./socialMedia.interface";

// Define your simplified schema with only `videoId`, `title`, and `isActive`
const SocialMediaSchema = new Schema<ISocialMedia, ISocialMediaModel>(
  {
    videoId: {
      type: String,
      required: true, // videoId is required
    },
    title: {
      type: String,
      required: true, // title is required
    },
    isActive: {
      type: Boolean,
      default: true, // Default value for isActive is true
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: {
      virtuals: true, // Include virtual fields in JSON output
    },
  }
);

// Create and export the SocialMedia model
export const SocialMedia = model<ISocialMedia, ISocialMediaModel>(
  "SocialMedia",
  SocialMediaSchema
);
