import { Model, Types } from "mongoose";

export interface INews {
  title: string;
  subTitle: string;
  description: string;
  author: string;
  category: Types.ObjectId | string;
  publishDate: Date;
  status: "draft" | "published" | "archived";
  // type: "news" | "opinion" | "analysis" | "feature";
  feature: boolean;
  tags: string[];
  media: string[];
  language?: "en" | "bn";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export type INewsModel = Model<INews, Record<string, unknown>>;
