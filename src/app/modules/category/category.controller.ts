import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryService } from "./category.service";
import { ICategory } from "./category.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { Category } from "./category.model";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { ...categoryData } = req.body;

  const existingCategory = await Category.findOne({ name: categoryData.name });
  if (existingCategory) {
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  if (req.file) {
    categoryData.image = getFileUrl(req.file.filename);
  }

  const result = await CategoryService.createCategory(categoryData);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(id);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm"]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryService.getAllCategories(
    filters,
    paginationOptions
  );

  sendResponse<ICategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { ...categoryData } = req.body;
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (req.file) {
    if (existingCategory.image) {
      const oldFilename = existingCategory.image.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    categoryData.image = getFileUrl(req.file.filename);
  }

  const result = await CategoryService.updateCategory(id, categoryData);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await CategoryService.getSingleCategory(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Make not found");
  }

  if (category.image) {
    const filename = category.image.split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await CategoryService.deleteCategory(id);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
