import { INews } from "./news.interface";
import { News } from "./news.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { newsSearchableFields } from "./news.contants";
import { Category } from "../category/category.model";

const createNews = async (payload: INews): Promise<INews | null> => {
  const result = await News.create(payload);
  return result;
};

const getSingleNews = async (id: string): Promise<INews | null> => {
  const result = await News.findById(id).populate("category");
  return result;
};
export const getNewsByCategorySlug = async (slug: string) => {
  const category = await Category.findOne({ slug });

  if (!category) return [];

  const news = await News.find({ category: category._id }).populate('category');

  return news;
};
const getSingleNewsByTitle = async (title: string): Promise<INews | null> => {
  const result = await News.findOne({ title }).populate("category");
  return result;
};

const getAllNews = async (
  filters: Record<string, any>, // Use appropriate filters, e.g., status, type, etc.
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<INews[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: newsSearchableFields.map((field) => ({
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

  const result = await News.find(whereConditions)
    .populate("category")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await News.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateNews = async (
  id: string,
  payload: Partial<INews>
): Promise<INews | null> => {
  const result = await News.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteNews = async (id: string): Promise<INews | null> => {
  const result = await News.findByIdAndDelete(id);
  return result;
};

const getHighlightedNews = async (
  limit: number = 10
): Promise<{
  trending: INews[];
  latest: INews[];
}> => {
  const [trending, latest] = await Promise.all([
    News.find({ status: "published", isTrending: true })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit),

    News.find({ status: "published" })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit),
  ]);

  return { trending, latest };
};

export const NewsService = {
  createNews,
  getSingleNews,
  getSingleNewsByTitle,
  getAllNews,
  updateNews,
  deleteNews,
  getNewsByCategorySlug,
  getHighlightedNews,

};
