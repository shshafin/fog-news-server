import { model, Schema } from "mongoose";
import { IJobPost, IJobPostModel } from "./job.interface";

const jobPostSchema = new Schema<IJobPost, IJobPostModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one requirement is required",
      },
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Invalid email format",
      ],
    },
    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      default: "full-time",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["entry", "mid", "senior", "executive"],
    },
    education: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobPostSchema.index({ title: "text", description: "text", company: "text" });
jobPostSchema.index({ applicationDeadline: 1 });
jobPostSchema.index({ jobType: 1, experienceLevel: 1, category: 1 });

jobPostSchema.virtual("applicationCount", {
  ref: "JobApplication",
  localField: "_id",
  foreignField: "jobPost",
  count: true,
});

jobPostSchema.virtual("applications", {
  ref: "JobApplication",
  localField: "_id",
  foreignField: "jobPost",
});

export const Job = model<IJobPost, IJobPostModel>("Job", jobPostSchema);
