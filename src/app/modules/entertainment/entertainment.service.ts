import {
  IEntertainment,
  IEntertainmentFilters,
} from "./entertainment.interface";
import { Entertainment } from "./entertainment.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { entertainmentSearchableFields } from "./entertainment.constants";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createEntertainment = async (
  payload: IEntertainment
): Promise<IEntertainment | null> => {
  const result = await Entertainment.create(payload);
  return result;
};

const getSingleEntertainment = async (
  id: string
): Promise<IEntertainment | null> => {
  const result = await Entertainment.findById(id).populate("category");
  return result;
};

const getAllEntertainments = async (
  filters: IEntertainmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEntertainment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: entertainmentSearchableFields.map((field) => ({
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
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "category") {
          return {
            [field]: Types.ObjectId.isValid(value)
              ? new Types.ObjectId(value)
              : value,
          };
        }
        return { [field]: value };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Entertainment.find(whereConditions)
    .populate("category")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Entertainment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateEntertainment = async (
  id: string,
  payload: Partial<IEntertainment>
): Promise<IEntertainment | null> => {
  const existingEntertainment = await Entertainment.findById(id);

  if (!existingEntertainment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entertainment not found");
  }

  const result = await Entertainment.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteEntertainment = async (
  id: string
): Promise<IEntertainment | null> => {
  const result = await Entertainment.findByIdAndDelete(id);
  return result;
};

export const EntertainmentService = {
  createEntertainment,
  getSingleEntertainment,
  getAllEntertainments,
  updateEntertainment,
  deleteEntertainment,
};
