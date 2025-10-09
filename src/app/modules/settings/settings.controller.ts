import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiError";
import { getFileUrl, deleteFile } from "../../../helpers/fileHandlers";
import { SiteSettingsService } from "./settings.service";
import { ISiteSettings } from "./settings.interface";

const createOrUpdateSettings = catchAsync(
  async (req: Request, res: Response) => {
    let { data } = req.body;

    // Parse JSON data if it's a string
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JSON data");
      }
    }

    // Get existing settings to handle file deletion
    const existingSettings = await SiteSettingsService.getSiteSettings();

    // Handle file uploads
    if (req.files) {
      const files = req.files as Express.Multer.File[];

      // Process uploaded files
      files.forEach((file) => {
        if (file.fieldname === "logo") {
          // Delete old logo if exists
          if (existingSettings?.logo) {
            const oldFilename = existingSettings.logo.split("/").pop();
            deleteFile(oldFilename ?? "");
          }
          data.logo = getFileUrl(file.filename);
        } else if (file.fieldname === "favicon") {
          // Delete old favicon if exists
          if (existingSettings?.favicon) {
            const oldFilename = existingSettings.favicon.split("/").pop();
            deleteFile(oldFilename ?? "");
          }
          data.favicon = getFileUrl(file.filename);
        }
      });
    }

    const result = await SiteSettingsService.createOrUpdateSiteSettings(data);

    sendResponse<ISiteSettings>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Site settings updated successfully",
      data: result,
    });
  }
);

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingsService.getSiteSettings();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Site settings not found");
  }

  sendResponse<ISiteSettings>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site settings fetched successfully",
    data: result,
  });
});

export const SiteSettingsController = {
  createOrUpdateSettings,
  getSettings,
};
