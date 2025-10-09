import { Model, Types } from "mongoose";

export interface IComment {
  news: Types.ObjectId | string;
  comment: string;
}

export type ICommentModel = Model<IComment, Record<string, unknown>>;
