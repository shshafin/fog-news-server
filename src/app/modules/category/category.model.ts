import { Schema, Types, model } from "mongoose";
import { ICategory, ICategoryModel } from "./category.interface";

const CategorySchema = new Schema<ICategory, ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
    isActive: {
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

// Index for slug (ensure uniqueness)
CategorySchema.index({ name: 1, slug: 1 }, { unique: true });

CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

export const Category = model<ICategory, ICategoryModel>(
  "Category",
  CategorySchema
);
