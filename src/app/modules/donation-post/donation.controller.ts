import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DonationService } from "./donation.service";
import { IDonationPost } from "./donation.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { DonationPost } from "./donation.model";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";
import ApiError from "../../../errors/ApiError";
import { DonationValidation } from "./donation.validation";
import { donationFilterableFields } from "./donation.constants";

const createDonation = catchAsync(async (req: Request, res: Response) => {
  const { ...donationData } = req.body;

  // Check for existing title
  const existingDonation = await DonationPost.findOne({
    title: donationData.title,
  });
  if (existingDonation) {
    if (req.file) deleteFile(req.file.filename);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Donation with this title already exists"
    );
  }

  // Handle file upload
  if (req.file) {
    donationData.featuredImage = getFileUrl(req.file.filename);
  }

  const result = await DonationService.createDonation(donationData);

  sendResponse<IDonationPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation post created successfully",
    data: result,
  });
});

const getSingleDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DonationService.getSingleDonation(id);

  sendResponse<IDonationPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation post fetched successfully",
    data: result,
  });
});

const getDonationBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await DonationService.getDonationBySlug(slug);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation post not found");
  }

  sendResponse<IDonationPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation post fetched successfully",
    data: result,
  });
});

const getAllDonations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, donationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DonationService.getAllDonations(
    filters,
    paginationOptions
  );

  sendResponse<IDonationPost[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donations fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  const existingDonation = await DonationPost.findById(id);
  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation post not found");
  }

  // Handle file upload
  if (req.file) {
    if (existingDonation.featuredImage) {
      const oldFilename = existingDonation.featuredImage.split("/").pop();
      deleteFile(oldFilename ?? "");
    }
    updateData.featuredImage = getFileUrl(req.file.filename);
  }

  const result = await DonationService.updateDonation(id, updateData);

  sendResponse<IDonationPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation post updated successfully",
    data: result,
  });
});

const deleteDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const donation = await DonationService.getSingleDonation(id);
  if (!donation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation post not found");
  }

  if (donation.featuredImage) {
    const filename = donation.featuredImage.split("/").pop();
    deleteFile(filename ?? "");
  }

  const result = await DonationService.deleteDonation(id);

  sendResponse<IDonationPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation post deleted successfully",
    data: result,
  });
});

const addDonationTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const transactionData = req.body;

    const result = await DonationService.addDonationTransaction(
      id,
      transactionData
    );

    sendResponse<IDonationPost>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donation transaction added successfully",
      data: result,
    });
  }
);

const handlePaymentCallback = catchAsync(
  async (req: Request, res: Response) => {
    const { donationId, transactionId } = req.params;
    const { status } = req.body;

    if (!["success", "failed"].includes(status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status value");
    }

    const result = await DonationService.updateTransactionStatus(
      donationId,
      transactionId,
      status as "success" | "failed"
    );

    sendResponse<IDonationPost>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Donation status updated to ${status}`,
      data: result,
    });
  }
);

export const DonationController = {
  createDonation,
  getSingleDonation,
  getDonationBySlug,
  getAllDonations,
  updateDonation,
  deleteDonation,
  addDonationTransaction,
  handlePaymentCallback,
};
