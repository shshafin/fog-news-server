import { Model, Schema } from "mongoose";

export type ApplicationStatus =
  | "submitted"
  | "under-review"
  | "rejected"
  | "shortlisted"
  | "hired";

export type EmailStatus = "pending" | "sent" | "failed" | "retrying";

export interface IJobApplication {
  jobPost: Schema.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  phone: string;
  coverLetter: string;
  resumePath: string;
  status?: ApplicationStatus;
  appliedDate: Date;
  emailStatus?: EmailStatus;
  emailSentAt?: Date;
  emailRetries?: number;
  lastEmailError?: string;
}

export type IJobApplicationModel = Model<
  IJobApplication,
  Record<string, unknown>
>;
