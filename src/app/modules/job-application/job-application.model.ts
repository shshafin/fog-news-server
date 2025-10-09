import { model, Schema } from "mongoose";
import {
  IJobApplication,
  IJobApplicationModel,
} from "./job-application.interface";

const jobApplicationSchema = new Schema<IJobApplication, IJobApplicationModel>(
  {
    jobPost: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Invalid email format",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      default: "",
    },
    resumePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under-review", "rejected", "shortlisted", "hired"],
      default: "submitted",
      index: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "retrying"],
      default: "pending",
    },
    emailSentAt: {
      type: Date,
    },
    emailRetries: {
      type: Number,
      default: 0,
    },
    lastEmailError: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
jobApplicationSchema.index({ applicantEmail: 1 });
jobApplicationSchema.index({ appliedDate: -1 });
jobApplicationSchema.index({ status: 1, emailStatus: 1 });

// Pre-save hook to handle email status
jobApplicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.emailStatus = "pending";
    this.status = "submitted";
  }
  next();
});

export const JobApplication = model<IJobApplication, IJobApplicationModel>(
  "JobApplication",
  jobApplicationSchema
);
