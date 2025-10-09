import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SocialMediaService } from "./socialMedia.service";
import { ISocialMedia } from "./socialMedia.interface";

const createSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // Call the service to create social media
  const result = await SocialMediaService.createSocialMedia(payload);

  // Send the response
  sendResponse<ISocialMedia>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Multimedia created successfully",
    data: result,
  });
});

const getAllSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialMediaService.getAllSocialMedia();

  sendResponse<ISocialMedia[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social media links retrieved successfully",
    data: result,
  });
});

const getSingleSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SocialMediaService.getSingleSocialMedia(id);

  sendResponse<ISocialMedia>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social media retrieved successfully",
    data: result,
  });
});

const updateSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await SocialMediaService.updateSocialMedia(id, payload);

  sendResponse<ISocialMedia>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social media updated successfully",
    data: result,
  });
});

const deleteSocialMedia = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SocialMediaService.deleteSocialMedia(id);

  sendResponse<ISocialMedia>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social media deleted successfully",
    data: result,
  });
});

export const SocialMediaController = {
  createSocialMedia,
  getAllSocialMedia,
  getSingleSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
