import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { EpaperService } from "./EPaper.service";
import { IEpaper } from "./EPaper.interface";
import {
  deleteFile,
  getFileUrl,
  uploadFile,
} from "../../../helpers/fileHandlers";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";

const createEpaper = catchAsync(async (req: Request, res: Response) => {
  let { ...data } = req.body;

  // Parse JSON if needed
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  // Validate ObjectId fields
  const objectIdFields = ["category"];
  for (const field of objectIdFields) {
    if (data[field] && !Types.ObjectId.isValid(data[field])) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${field} ID`);
    }
  }

  // Extract uploaded files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const mainFile = files["file"]?.[0];
  const thumbnailFile = files["thumbnail"]?.[0];

  // Validate required fields
  if (!data.title) {
    // Clean up files if title is missing
    if (mainFile) deleteFile(mainFile.filename);
    if (thumbnailFile) deleteFile(thumbnailFile.filename);
    throw new ApiError(httpStatus.BAD_REQUEST, "Title is required");
  }

  if (!mainFile) {
    // Clean up thumbnail if main file is missing
    if (thumbnailFile) deleteFile(thumbnailFile.filename);
    throw new ApiError(httpStatus.BAD_REQUEST, "Main file is required");
  }

  // Check for duplicate title
  const existingEpaper = await EpaperService.getEpaperByTitle(data.title);
  if (existingEpaper) {
    // Clean up files if duplicate exists
    if (mainFile) deleteFile(mainFile.filename);
    if (thumbnailFile) deleteFile(thumbnailFile.filename);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Epaper with this title already exists"
    );
  }

  // Prepare Epaper data
  const epaperData: IEpaper = {
    title: data.title,
    date: data.date ? new Date(data.date) : new Date(),
    file: mainFile ? getFileUrl(mainFile.filename) : "",
    thumbnail: thumbnailFile ? getFileUrl(thumbnailFile.filename) : "",
    edition: data.edition,
    category: data.category,
    isActive: data.isActive !== "false",
  };

  // Create Epaper in database
  const result = await EpaperService.createEpaper(epaperData);

  sendResponse<IEpaper>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ePaper created successfully!",
    data: result,
  });
});

// Get all ePapers
const getAllEpapers = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const paginationOptions = req.query;

  const result = await EpaperService.getAllEpapers(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ePapers fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get single ePaper
const getSingleEpaper = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EpaperService.getSingleEpaper(id);

  sendResponse<IEpaper>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ePaper fetched successfully!",
    data: result,
  });
});

// Update ePaper
const updateEpaper = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = req.body;
  const result = await EpaperService.updateEpaper(id, validatedData.body);

  sendResponse<IEpaper>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ePaper updated successfully!",
    data: result,
  });
});

// Delete ePaper
const deleteEpaper = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EpaperService.deleteEpaper(id);

  sendResponse<IEpaper>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ePaper deleted successfully!",
    data: result,
  });
});

export const EpaperController = {
  createEpaper,
  getAllEpapers,
  getSingleEpaper,
  updateEpaper,
  deleteEpaper,
};
