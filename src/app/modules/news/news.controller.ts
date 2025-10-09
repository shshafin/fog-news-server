import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { getNewsByCategorySlug, NewsService } from "./news.service";
import { INews } from "./news.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import { newsFilterableFields } from "./news.contants";
import { Types } from "mongoose";

const createNews = catchAsync(async (req: Request, res: Response) => {
  let { ...data } = req.body;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const objectIdFields = ["category"];
  for (const field of objectIdFields) {
    if (data[field] && !Types.ObjectId.isValid(data[field])) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} ID`);
    }
  }

  if (data.title) {
    const existingNews = await NewsService.getSingleNewsByTitle(data.title);
    if (existingNews) {
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach(
          (file: Express.Multer.File) => deleteFile(file.filename)
        );
      }
      throw new ApiError(httpStatus.BAD_REQUEST, "News article already exists");
    }
  }

  // Handle file uploads
  if (req.files) {
    data.media = (req.files as Express.Multer.File[]).map((file) =>
      getFileUrl(file.filename)
    );
  }

  const result = await NewsService.createNews(data);

  sendResponse<INews>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "News article created successfully",
    data: result,
  });
});

const getSingleNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NewsService.getSingleNews(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "News article not found");
  }

  sendResponse<INews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News article fetched successfully",
    data: result,
  });
});
const getNewsByCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const news = await getNewsByCategorySlug(slug);

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getAllNews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, newsFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await NewsService.getAllNews(filters, paginationOptions);

  sendResponse<INews[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News articles fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { ...updatedData } = req.body;

  // Parse updated data if it's a string
  if (typeof updatedData === "string") {
    updatedData = JSON.parse(updatedData);
  }

  // Fetch existing news article
  const existingNews = await NewsService.getSingleNews(id);
  if (!existingNews) {
    throw new ApiError(httpStatus.NOT_FOUND, "News article not found");
  }

  // Validate ObjectId fields for category
  if (updatedData.category && !Types.ObjectId.isValid(updatedData.category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category ID");
  }

  // Handle media files update
  if (Array.isArray(req.files) && req.files.length > 0) {
    // Delete existing media files
    if (existingNews.media && existingNews.media.length > 0) {
      await Promise.all(
        existingNews.media.map(async (mediaUrl) => {
          const filename = mediaUrl.split("/").pop();
          if (filename) {
            await deleteFile(filename); // Ensure you wait for file deletion
          }
        })
      );
    }

    // Add new media files to updatedData
    updatedData.media = (req.files as Express.Multer.File[]).map(
      (file) => getFileUrl(file.filename) // Assuming getFileUrl is defined to return the file URL
    );
  }

  // Update the news article in the database
  const updatedNews = await NewsService.updateNews(id, updatedData);

  // Send the response back
  res.status(httpStatus.OK).json({
    success: true,
    message: "News updated successfully",
    data: updatedNews,
  });
});

const deleteNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingNews = await NewsService.getSingleNews(id);
  if (!existingNews) {
    throw new ApiError(httpStatus.NOT_FOUND, "News article not found");
  }

  // Delete associated media files if any
  if (existingNews.media.length > 0) {
    const filename = existingNews.media[0].split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await NewsService.deleteNews(id);

  sendResponse<INews>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News article deleted successfully",
    data: result,
  });
});

export const NewsController = {
  createNews,
  getSingleNews,
  getNewsByCategory,
  getAllNews,
  updateNews,
  deleteNews,
};
