import { Model } from "mongoose";

export interface PollOption {
  _id?: string;
  option: string;
  votes: number;
}

export interface IPoll {
  title?: string;
  description?: string;
  question: string;
  options: PollOption[];
  language?: "en" | "bn";
}

export type IPollModel = Model<IPoll, Record<string, unknown>>;
