import { Schema, model } from "mongoose";
import { INewsletter, INewsletterModel } from "./newsletter.interface";

const NewsletterSchema = new Schema<INewsletter, INewsletterModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Newsletter = model<INewsletter, INewsletterModel>(
  "Newsletter",
  NewsletterSchema
);
