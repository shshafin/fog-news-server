import { ICategory, ICategoryFilters } from "./category.interface";
import { Category } from "./category.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { categorySearchableFields } from "./category.constants";

const createCategory = async (
  payload: ICategory
): Promise<ICategory | null> => {
  const result = await Category.create(payload);
  return result;
};

const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findById(id);
  return result;
};

const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: categorySearchableFields.map((field) => ({
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
        if (field === "parentCategory") {
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

  const result = await Category.find(whereConditions)
    .populate("parentCategory")
    .populate("children")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
