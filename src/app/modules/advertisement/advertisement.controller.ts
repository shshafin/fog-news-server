import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdvertisementService } from "./advertisement.service";
import { IAdvertisement } from "./advertisement.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import { advertisementFilterableFields } from "./advertisement.constants";

const createAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    description,
    imageUrl,
    targetUrl,
    target,
    type,
    status,
    startDate,
    endDate,
    priority,
  } = req.body;
  // Handle file upload if provided
  let imageUrlFinal = imageUrl;
  if (req.file) {
    imageUrlFinal = getFileUrl(req.file.filename);
  }

  const advertisementData = {
    title,
    description,
    imageUrl: imageUrlFinal,
    targetUrl,
    target,
    type,
    status,
    startDate,
    endDate,
    priority,
  };

  const result = await AdvertisementService.createAdvertisement(
    advertisementData as IAdvertisement
  );

  sendResponse<IAdvertisement>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Advertisement created successfully",
    data: result,
  });
});

const getSingleAdvertisement = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdvertisementService.getSingleAdvertisement(id);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Advertisement not found");
    }

    sendResponse<IAdvertisement>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Advertisement fetched successfully",
      data: result,
    });
  }
);

const getAllAdvertisements = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, advertisementFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AdvertisementService.getAllAdvertisements(
    filters,
    paginationOptions
  );

  sendResponse<IAdvertisement[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Advertisements fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getActiveAdvertisements = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdvertisementService.getActiveAdvertisements();

    sendResponse<IAdvertisement[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Active advertisements fetched successfully",
      data: result,
    });
  }
);

const updateAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const existingAdvertisement =
    await AdvertisementService.getSingleAdvertisement(id);
  if (!existingAdvertisement) {
    throw new ApiError(httpStatus.NOT_FOUND, "Advertisement not found");
  }

  // Handle file update if provided
  if (req.file) {
    if (existingAdvertisement.imageUrl) {
      const oldFile = existingAdvertisement.imageUrl.split("/").pop();
      deleteFile(oldFile ?? "");
    }
    payload.imageUrl = getFileUrl(req.file.filename);
  }

  const result = await AdvertisementService.updateAdvertisement(id, payload);

  sendResponse<IAdvertisement>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Advertisement updated successfully",
    data: result,
  });
});

const deleteAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingAdvertisement =
    await AdvertisementService.getSingleAdvertisement(id);
  if (!existingAdvertisement) {
    throw new ApiError(httpStatus.NOT_FOUND, "Advertisement not found");
  }

  // Delete associated image file if any
  if (existingAdvertisement.imageUrl) {
    const filename = existingAdvertisement.imageUrl.split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await AdvertisementService.deleteAdvertisement(id);

  sendResponse<IAdvertisement>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Advertisement deleted successfully",
    data: result,
  });
});

const toggleAdvertisementStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdvertisementService.toggleAdvertisementStatus(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Advertisement status toggled successfully",
      data: result,
    });
  }
);

const countActiveAdvertisements = catchAsync(
  async (req: Request, res: Response) => {
    const count = await AdvertisementService.countActiveAdvertisements();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Active advertisements count retrieved successfully",
      data: { count },
    });
  }
);

const getExpiredAdvertisements = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdvertisementService.getExpiredAdvertisements();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expired advertisements retrieved successfully",
      data: result,
    });
  }
);

export const AdvertisementController = {
  createAdvertisement,
  getSingleAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
  countActiveAdvertisements,
  getExpiredAdvertisements,
};
