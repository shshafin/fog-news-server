import { IJobPost } from "./job.interface";
import { Job } from "./job.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { jobSearchableFields } from "./job.constants";

const createJob = async (payload: IJobPost): Promise<IJobPost | null> => {
  const result = await Job.create(payload);
  return result;
};

const getSingleJob = async (id: string): Promise<IJobPost | null> => {
  const result = await Job.findById(id);
  return result;
};

const getSingleJobByTitle = async (title: string): Promise<IJobPost | null> => {
  const result = await Job.findOne({ title });
  return result;
};

const getAllJobs = async (
  filters: Record<string, any>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IJobPost[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: jobSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        // Handle boolean values
        if (field === "isActive") {
          return { [field]: value === "true" || value === true };
        }
        return { [field]: value };
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  // Only show active jobs by default
  if (!filtersData.hasOwnProperty("isActive")) {
    andConditions.push({ isActive: true });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : { isActive: true };

  const result = await Job.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Job.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateJob = async (
  id: string,
  payload: Partial<IJobPost>
): Promise<IJobPost | null> => {
  const result = await Job.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteJob = async (id: string): Promise<IJobPost | null> => {
  const result = await Job.findByIdAndDelete(id);
  return result;
};

export const JobService = {
  createJob,
  getSingleJob,
  getSingleJobByTitle,
  getAllJobs,
  updateJob,
  deleteJob,
};
