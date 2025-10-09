import { Schema, model } from "mongoose";
import { IComment, ICommentModel } from "./comment.interface";

const CommentSchema = new Schema<IComment, ICommentModel>(
  {
    news: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Comment = model<IComment, ICommentModel>("Comment", CommentSchema);
