import { model, Schema } from "mongoose";
import { IEntertainment, IEntertainmentModel } from "./entertainment.interface";

const entertainmentSchema = new Schema<IEntertainment, IEntertainmentModel>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    media: {
      type: String,
      required: false,
    },
    link: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Entertainment = model<IEntertainment, IEntertainmentModel>(
  "Entertainment",
  entertainmentSchema
);
