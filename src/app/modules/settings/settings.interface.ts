import { Model } from "mongoose";

export interface ISiteSettings {
  siteName: {
    en: string;
    bn: string;
  };
  siteDescription: {
    en: string;
    bn: string;
  };
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  language: "en" | "bn";
}

export type ISiteSettingsModel = Model<ISiteSettings, Record<string, unknown>>;
