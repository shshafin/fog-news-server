import { Document, Model, Types } from "mongoose";

export interface IDonationTransaction extends Document {
  amount: number;
  donorName: string;
  donorEmail: string;
  transactionId: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
  date: Date;
}

export interface IDonationPost extends Document {
  title: string;
  slug?: string;
  description: string;
  targetAmount?: number;
  collectedAmount: number;
  donations: Types.DocumentArray<IDonationTransaction>;
  category: Types.ObjectId;
  isActive: boolean;
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonationPostModel extends Model<IDonationPost> {
  // Add static methods here if needed
  findBySlug(slug: string): Promise<IDonationPost | null>;
}

export interface IDonationFilters {
  searchTerm?: string;
  title?: string;
  slug?: string;
  category?: string;
  isActive?: boolean;
  minAmount?: number;
  maxAmount?: number;
}
