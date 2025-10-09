import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EntertainmentService } from "./entertainment.service";
import { IEntertainment } from "./entertainment.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { entertainmentFilterableFields } from "./entertainment.constants";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";

const createEntertainment = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const payload = req.body;

  if (!files.thumbnail || files.thumbnail.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Thumbnail is required");
  }

  // Handle thumbnail
  payload.thumbnail = getFileUrl(files.thumbnail[0].filename);

  // Handle media if exists
  if (files.media && files.media.length > 0) {
    payload.media = getFileUrl(files.media[0].filename);
  }

  const result = await EntertainmentService.createEntertainment(payload);

  sendResponse<IEntertainment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Entertainment created successfully",
    data: result,
  });
});

const getSingleEntertainment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EntertainmentService.getSingleEntertainment(id);

    sendResponse<IEntertainment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Entertainment fetched successfully",
      data: result,
    });
  }
);

const getAllEntertainments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, entertainmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EntertainmentService.getAllEntertainments(
    filters,
    paginationOptions
  );

  sendResponse<IEntertainment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Entertainments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateEntertainment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const payload = req.body;

  const existingEntertainment =
    await EntertainmentService.getSingleEntertainment(id);

  if (!existingEntertainment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entertainment not found");
  }

  // Handle thumbnail update
  if (files.thumbnail && files.thumbnail.length > 0) {
    // Delete old thumbnail
    if (existingEntertainment.thumbnail) {
      const oldFilename = existingEntertainment.thumbnail.split("/").pop();
      deleteFile(oldFilename || "");
    }
    payload.thumbnail = getFileUrl(files.thumbnail[0].filename);
  }

  // Handle media update
  if (files.media && files.media.length > 0) {
    // Delete old media
    if (existingEntertainment.media) {
      const oldFilename = existingEntertainment.media.split("/").pop();
      deleteFile(oldFilename || "");
    }
    payload.media = getFileUrl(files.media[0].filename);
  }

  const result = await EntertainmentService.updateEntertainment(id, payload);

  sendResponse<IEntertainment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Entertainment updated successfully",
    data: result,
  });
});

const deleteEntertainment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const entertainment = await EntertainmentService.getSingleEntertainment(id);

  if (!entertainment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entertainment not found");
  }

  // Delete associated files
  if (entertainment.thumbnail) {
    const thumbnail = entertainment.thumbnail.split("/").pop();
    deleteFile(thumbnail || "");
  }

  if (entertainment.media) {
    const media = entertainment.media.split("/").pop();
    deleteFile(media || "");
  }

  const result = await EntertainmentService.deleteEntertainment(id);

  sendResponse<IEntertainment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Entertainment deleted successfully",
    data: result,
  });
});

export const EntertainmentController = {
  createEntertainment,
  getSingleEntertainment,
  getAllEntertainments,
  updateEntertainment,
  deleteEntertainment,
};
