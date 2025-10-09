import { Model } from "mongoose";

export interface IJobPost {
  title: string;
  description: string;
  requirements: string[];
  company: string;
  location: string;
  salary: string;
  applicationDeadline: Date;
  contactEmail: string;
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  category: string;
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  education?: string[];
  skills?: string[];
  image?: string;
  isActive?: boolean;
  filter?: any;
}
export type IJobPostModel = Model<IJobPost, Record<string, unknown>>;
