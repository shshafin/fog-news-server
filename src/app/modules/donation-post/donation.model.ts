import { Schema, model, Types } from "mongoose";
import {
  IDonationTransaction,
  IDonationPost,
  IDonationPostModel,
  IDonationFilters,
} from "./donation.interface";

const donationTransactionSchema = new Schema<IDonationTransaction>(
  {
    amount: {
      type: Number,
      required: true,
      min: [1, "Donation amount must be at least 1"],
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "sslcommerz",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
); // Embedded documents don't need their own _id

const donationPostSchema = new Schema<IDonationPost, IDonationPostModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      min: 0,
      default: null,
    },
    collectedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    donations: [donationTransactionSchema],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    featuredImage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for search and filtering
donationPostSchema.index({ title: "text", description: "text" });
donationPostSchema.index({ createdAt: -1 });

// Virtual for progress percentage
donationPostSchema.virtual("progress").get(function () {
  if (!this.targetAmount) return 0;
  return Math.min(
    100,
    Math.round((this.collectedAmount / this.targetAmount) * 100)
  );
});

// Virtual for donation count
donationPostSchema.virtual("donationCount").get(function () {
  return this.donations.filter((d) => d.status === "success").length;
});

// Auto-calculate collected amount
donationPostSchema.pre<IDonationPost>("save", function (next) {
  if (this.isModified("donations")) {
    this.collectedAmount = this.donations
      .filter((d) => d.status === "success")
      .reduce((sum, donation) => sum + donation.amount, 0);
  }
  next();
});

// Static method for finding by slug
donationPostSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug }).populate("category");
};

// Middleware to generate slug before saving
donationPostSchema.pre<IDonationPost>("save", function (next) {
  if (!this.slug && this.title) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    this.slug = `${slug}-${Date.now().toString(36)}`;
  }
  next();
});

export const DonationPost = model<IDonationPost, IDonationPostModel>(
  "DonationPost",
  donationPostSchema
);
