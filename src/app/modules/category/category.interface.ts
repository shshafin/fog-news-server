import { Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug?: string;
  parentCategory?: Types.ObjectId;
  image?: string;
  language?: "en" | "bn";
  isActive?: boolean;
}

export type ICategoryModel = Model<ICategory, Record<string, unknown>>;

export interface ICategoryFilters {
  searchTerm?: string;
  name?: string;
  slug?: string;
  parentCategory?: Types.ObjectId | string;
  isActive?: boolean;
}
