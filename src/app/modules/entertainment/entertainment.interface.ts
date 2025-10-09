import { Model, Types } from "mongoose";

export interface IEntertainment {
  title: string;
  description: string;
  thumbnail: string;
  media?: string;
  link?: string;
  category: Types.ObjectId | string;
}

export type IEntertainmentModel = Model<
  IEntertainment,
  Record<string, unknown>
>;

export interface IEntertainmentFilters {
  searchTerm?: string;
  title?: string;
  category?: string;
}
