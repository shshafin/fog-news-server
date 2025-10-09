import { Document } from "mongoose";

export interface VideoBlock extends Document {
  title: string;
  videoUrl: string; // YouTube or custom video URL
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
