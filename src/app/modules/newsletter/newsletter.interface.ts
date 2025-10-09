import { Model, Types } from "mongoose";

export interface INewsletter {
  email: string;
  isSubscribed?: boolean;
}

export type INewsletterModel = Model<INewsletter, Record<string, unknown>>;
