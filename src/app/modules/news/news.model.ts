import { Schema, model, Types } from "mongoose";
import { INews, INewsModel } from "./news.interface";

const NewsSchema = new Schema<INews, INewsModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    feature: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    media: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
    seo: {
      metaTitle: {
        type: String,
        trim: true,
      },
      metaDescription: {
        type: String,
        trim: true,
      },
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Index for title and category (you can add more fields if needed)
NewsSchema.index({ title: 1, category: 1 }, { unique: true });

export const News = model<INews, INewsModel>("News", NewsSchema);
