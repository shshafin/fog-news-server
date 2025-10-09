import { IDonationPost, IDonationFilters } from "./donation.interface";
import { DonationPost } from "./donation.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { donationSearchableFields } from "./donation.constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createDonation = async (
  payload: IDonationPost
): Promise<IDonationPost | null> => {
  // Check if donation with same title exists
  const existingDonation = await DonationPost.findOne({ title: payload.title });
  if (existingDonation) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Donation post with this title already exists"
    );
  }

  const result = await DonationPost.create(payload);
  return result;
};

const getSingleDonation = async (id: string): Promise<IDonationPost | null> => {
  const result = await DonationPost.findById(id).populate("category");
  return result;
};

const getDonationBySlug = async (
  slug: string
): Promise<IDonationPost | null> => {
  const result = await DonationPost.findOne({ slug }).populate("category");
  return result;
};

const getAllDonations = async (
  filters: IDonationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDonationPost[]>> => {
  const { searchTerm, minAmount, maxAmount, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: donationSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Amount range filtering
  if (minAmount !== undefined || maxAmount !== undefined) {
    const amountFilter: any = {};
    if (minAmount !== undefined) amountFilter.$gte = minAmount;
    if (maxAmount !== undefined) amountFilter.$lte = maxAmount;

    andConditions.push({
      collectedAmount: amountFilter,
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (field === "category") {
          return {
            [field]:
              typeof value === "string" && Types.ObjectId.isValid(value)
                ? new Types.ObjectId(value)
                : value,
          };
        }
        return { [field]: value };
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await DonationPost.find(whereConditions)
    .populate("category")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await DonationPost.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateDonation = async (
  id: string,
  payload: Partial<IDonationPost>
): Promise<IDonationPost | null> => {
  const result = await DonationPost.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("category");

  return result;
};

const deleteDonation = async (id: string): Promise<IDonationPost | null> => {
  const result = await DonationPost.findByIdAndDelete(id);
  return result;
};

const addDonationTransaction = async (
  id: string,
  transactionData: any
): Promise<IDonationPost | null> => {
  const donation = await DonationPost.findById(id);
  if (!donation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation post not found");
  }

  // Add transaction to donations array
  const updatedDonation = await DonationPost.findByIdAndUpdate(
    id,
    {
      $push: {
        donations: {
          ...transactionData,
          status: "pending",
          date: new Date(),
        },
      },
    },
    { new: true }
  ).populate("category");

  return updatedDonation;
};

const updateTransactionStatus = async (
  donationId: string,
  transactionId: string,
  status: "success" | "failed"
): Promise<IDonationPost | null> => {
  const donation = await DonationPost.findOne({
    _id: donationId,
    "donations.transactionId": transactionId,
  });

  if (!donation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  // Find the index of the transaction
  const transactionIndex = donation.donations.findIndex(
    (t) => t.transactionId === transactionId
  );

  if (transactionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  // Update the transaction status
  donation.donations[transactionIndex].status = status;

  // Recalculate collected amount
  donation.collectedAmount = donation.donations
    .filter((d) => d.status === "success")
    .reduce((sum, donation) => sum + donation.amount, 0);

  const updatedDonation = await donation.save();
  return updatedDonation;
};

export const DonationService = {
  createDonation,
  getSingleDonation,
  getDonationBySlug,
  getAllDonations,
  updateDonation,
  deleteDonation,
  addDonationTransaction,
  updateTransactionStatus,
};
