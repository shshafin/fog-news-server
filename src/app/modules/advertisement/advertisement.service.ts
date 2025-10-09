import { SortOrder, Types } from "mongoose";
import { IAdvertisement } from "./advertisement.interface";
import { Advertisement } from "./advertisement.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { advertisementSearchableFields } from "./advertisement.constants";

const createAdvertisement = async (
  payload: IAdvertisement
): Promise<IAdvertisement | null> => {
  const result = await Advertisement.create(payload);
  return result;
};

const getSingleAdvertisement = async (
  id: string
): Promise<IAdvertisement | null> => {
  const result = await Advertisement.findById(id);
  return result;
};

const getAllAdvertisements = async (
  filters: Record<string, any>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAdvertisement[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: advertisementSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Advertisement.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Advertisement.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getActiveAdvertisements = async (): Promise<IAdvertisement[]> => {
  const now = new Date();
  return Advertisement.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ priority: -1 });
};

const updateAdvertisement = async (
  id: string,
  payload: Partial<IAdvertisement>
): Promise<IAdvertisement | null> => {
  const result = await Advertisement.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteAdvertisement = async (
  id: string
): Promise<IAdvertisement | null> => {
  const result = await Advertisement.findByIdAndDelete(id);
  return result;
};

const toggleAdvertisementStatus = async (
  id: string
): Promise<IAdvertisement | null> => {
  const advertisement = await Advertisement.findById(id);
  if (!advertisement) {
    return null;
  }
  advertisement.status =
    advertisement.status === "active" ? "inactive" : "active";
  return advertisement.save();
};

const countActiveAdvertisements = async (): Promise<number> => {
  const now = new Date();
  return Advertisement.countDocuments({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

const getExpiredAdvertisements = async (): Promise<IAdvertisement[]> => {
  const now = new Date();
  return Advertisement.find({
    endDate: { $lt: now },
    status: { $ne: "expired" },
  });
};

// Then add these to your exported service
export const AdvertisementService = {
  createAdvertisement,
  getSingleAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
  countActiveAdvertisements,
  getExpiredAdvertisements,
};
