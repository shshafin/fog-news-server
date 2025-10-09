import { Schema, model } from "mongoose";
import { ISiteSettings, ISiteSettingsModel } from "./settings.interface";

const SiteSettingsSchema = new Schema<ISiteSettings, ISiteSettingsModel>(
  {
    siteName: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      bn: {
        type: String,
        required: true,
        trim: true,
      },
    },
    siteDescription: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      bn: {
        type: String,
        required: true,
        trim: true,
      },
    },
    logo: {
      type: String,
      required: true,
    },
    favicon: {
      type: String,
      required: true,
    },
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
    },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

SiteSettingsSchema.pre("save", async function (next) {
  const count = await this.model("SiteSettings").countDocuments();
  if (count >= 1) {
    throw new Error("Only one site settings document is allowed");
  }
  next();
});

export const SiteSettings = model<ISiteSettings, ISiteSettingsModel>(
  "SiteSettings",
  SiteSettingsSchema
);
