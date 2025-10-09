import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ISocialMedia } from "./socialMedia.interface";
import { SocialMedia } from "./socialMedia.model";

const createSocialMedia = async (
  payload: ISocialMedia
): Promise<ISocialMedia> => {
  // Check if platform already exists
  // const existingPlatform = await SocialMedia.findOne({
  //   videoId: payload.videoId,
  // });
  // if (existingPlatform) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     `${payload.videoId} already exists`
  //   );
  // }

  const result = await SocialMedia.create(payload);
  return result;
};

const getAllSocialMedia = async (): Promise<ISocialMedia[]> => {
  return SocialMedia.find({ isActive: true }).sort({ order: 1 });
};

const getSingleSocialMedia = async (
  id: string
): Promise<ISocialMedia | null> => {
  const result = await SocialMedia.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }
  return result;
};

const updateSocialMedia = async (
  id: string,
  payload: Partial<ISocialMedia>
): Promise<ISocialMedia | null> => {
  const isExist = await SocialMedia.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }

  // Prevent platform change
  if (payload.videoId && payload.videoId !== isExist.videoId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot change platform type");
  }

  const result = await SocialMedia.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSocialMedia = async (id: string): Promise<ISocialMedia | null> => {
  const result = await SocialMedia.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }
  return result;
};

const toggleActiveStatus = async (id: string): Promise<ISocialMedia | null> => {
  const socialMedia = await SocialMedia.findById(id);
  if (!socialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }

  await socialMedia.save();
  return socialMedia;
};

export const SocialMediaService = {
  createSocialMedia,
  getAllSocialMedia,
  getSingleSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  toggleActiveStatus,
};
