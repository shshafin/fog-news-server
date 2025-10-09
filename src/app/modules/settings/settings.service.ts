import { IGenericResponse } from "../../../interfaces/common";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ISiteSettings } from "./settings.interface";
import { SiteSettings } from "./settings.model";

// Create or update site settings (only one document allowed)
export const createOrUpdateSiteSettings = async (
  payload: Partial<ISiteSettings>
): Promise<ISiteSettings> => {
  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) {
    const updatedSettings = await SiteSettings.findOneAndUpdate({}, payload, {
      new: true,
    });
    if (!updatedSettings) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update settings"
      );
    }
    return updatedSettings;
  } else {
    const newSettings = await SiteSettings.create(payload);
    return newSettings;
  }
};

// Get site settings (only one document exists)
export const getSiteSettings = async (): Promise<ISiteSettings | null> => {
  return await SiteSettings.findOne();
};

export const SiteSettingsService = {
  createOrUpdateSiteSettings,
  getSiteSettings,
};
