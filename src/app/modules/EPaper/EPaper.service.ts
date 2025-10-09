import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IEpaper } from "./EPaper.interface";
import { Epaper } from "./EPaper.model";

// Create ePaper
const createEpaper = async (payload: IEpaper): Promise<IEpaper> => {
  const result = await Epaper.create(payload);
  return result;
};

// Get all ePapers (with pagination)
const getAllEpapers = async (
  filters: Record<string, unknown>,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search by title or edition
  if (searchTerm) {
    andConditions.push({
      $or: ["title", "edition"].map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: Record<string, 1 | -1> = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Epaper.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Epaper.countDocuments(whereConditions);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Get single ePaper
const getSingleEpaper = async (id: string): Promise<IEpaper | null> => {
  return await Epaper.findById(id);
};

const getEpaperByTitle = async (title: string) => {
  const result = await Epaper.findOne({ title });
  return result;
};

// Update ePaper
const updateEpaper = async (
  id: string,
  payload: Partial<IEpaper>
): Promise<IEpaper | null> => {
  return await Epaper.findByIdAndUpdate(id, payload, { new: true });
};

// Delete ePaper (soft delete)
const deleteEpaper = async (id: string): Promise<IEpaper | null> => {
  return await Epaper.findByIdAndDelete(id);
};

export const EpaperService = {
  createEpaper,
  getAllEpapers,
  getSingleEpaper,
  getEpaperByTitle,
  updateEpaper,
  deleteEpaper,
};
