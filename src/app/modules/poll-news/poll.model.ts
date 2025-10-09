import { Schema, model } from "mongoose";
import { IPoll, IPollModel } from "./poll.interface";
const PollSchema = new Schema<IPoll, IPollModel>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      required: false,
    },
    question: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
    options: [
      {
        option: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

PollSchema.index({ title: 1, question: 1 }, { unique: true });

export const Poll = model<IPoll, IPollModel>("Poll", PollSchema);
