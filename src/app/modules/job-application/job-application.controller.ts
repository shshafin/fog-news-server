import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { JobApplicationService } from "./job-application.service";
import { IJobApplication } from "./job-application.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { jobApplicationFilterableFields } from "./job-application.constants";
import { deleteResume } from "../../../helpers/fileHandlers";
import path from "path";

const createJobApplication = catchAsync(async (req: Request, res: Response) => {
  const { ...applicationData } = req.body;

  if (typeof applicationData.jobPost === "string") {
    applicationData.jobPost = applicationData.jobPost;
  }

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Resume file is required");
  }

  // Extract just the filename and create the proper relative path
  const filename = path.basename(req.file.path);
  applicationData.resumePath = `/storage/applications/${filename}`;

  const result =
    await JobApplicationService.createJobApplication(applicationData);

  sendResponse<IJobApplication>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message:
      "Job application submitted successfully. Email notification has been sent.",
    data: result,
  });
});

// Add a controller for retrying failed emails (for admin use)
const retryFailedEmails = catchAsync(async (req: Request, res: Response) => {
  await JobApplicationService.retryFailedEmails();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email retry process completed",
  });
});

const getSingleJobApplication = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await JobApplicationService.getSingleJobApplication(id);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
    }

    sendResponse<IJobApplication>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Job application fetched successfully",
      data: result,
    });
  }
);

const getApplicationsByJob = catchAsync(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await JobApplicationService.getApplicationsByJob(
    jobId,
    paginationOptions
  );

  sendResponse<IJobApplication[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job applications fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getApplicationsByEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;
    const paginationOptions = pick(req.query, paginationFields);

    const result = await JobApplicationService.getApplicationsByEmail(
      email,
      paginationOptions
    );

    sendResponse<IJobApplication[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Job applications fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllJobApplications = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, jobApplicationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await JobApplicationService.getAllJobApplications(
      filters,
      paginationOptions
    );

    sendResponse<IJobApplication[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Job applications fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateJobApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;

  const existingApplication =
    await JobApplicationService.getSingleJobApplication(id);
  if (!existingApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
  }

  const result = await JobApplicationService.updateJobApplication(
    id,
    updatedData
  );

  sendResponse<IJobApplication>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job application updated successfully",
    data: result,
  });
});

const updateApplicationStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const existingApplication =
      await JobApplicationService.getSingleJobApplication(id);
    if (!existingApplication) {
      throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
    }

    const result = await JobApplicationService.updateApplicationStatus(
      id,
      status
    );

    sendResponse<IJobApplication>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Application status updated successfully",
      data: result,
    });
  }
);

const deleteJobApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingApplication =
    await JobApplicationService.getSingleJobApplication(id);
  if (!existingApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
  }

  // Delete associated resume file
  if (existingApplication.resumePath) {
    const filename = existingApplication.resumePath.split("/").pop();
    if (filename) {
      deleteResume(filename);
    }
  }

  const result = await JobApplicationService.deleteJobApplication(id);

  sendResponse<IJobApplication>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job application deleted successfully",
    data: result,
  });
});

export const JobApplicationController = {
  createJobApplication,
  retryFailedEmails,
  getSingleJobApplication,
  getApplicationsByJob,
  getApplicationsByEmail,
  getAllJobApplications,
  updateJobApplication,
  updateApplicationStatus,
  deleteJobApplication,
};
