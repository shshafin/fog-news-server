import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { JobService } from "./job.service";
import { IJobPost } from "./job.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import ApiError from "../../../errors/ApiError";
import { jobFilterableFields } from "./job.constants";
import { deleteFile, getFileUrl } from "../../../helpers/fileHandlers";

const createJob = catchAsync(async (req: Request, res: Response) => {
  let { ...jobData } = req.body;

  // Parse JSON fields if they come as strings
  if (typeof jobData.requirements === "string") {
    jobData.requirements = JSON.parse(jobData.requirements);
  }
  if (typeof jobData.education === "string") {
    jobData.education = JSON.parse(jobData.education);
  }
  if (typeof jobData.skills === "string") {
    jobData.skills = JSON.parse(jobData.skills);
  }

  // Check if job with same title already exists
  if (jobData.title) {
    const existingJob = await JobService.getSingleJobByTitle(jobData.title);
    if (existingJob) {
      // Delete uploaded file if it exists
      if (req.file) {
        deleteFile(req.file.filename);
      }
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Job with this title already exists"
      );
    }
  }

  // Handle file upload
  if (req.file) {
    jobData.image = getFileUrl(req.file.filename);
  }

  const result = await JobService.createJob(jobData);

  sendResponse<IJobPost>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getSingleJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobService.getSingleJob(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  sendResponse<IJobPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job fetched successfully",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jobFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await JobService.getAllJobs(filters, paginationOptions);

  sendResponse<IJobPost[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { ...updatedData } = req.body;

  // Parse JSON fields if they come as strings
  if (typeof updatedData.requirements === "string") {
    updatedData.requirements = JSON.parse(updatedData.requirements);
  }
  if (typeof updatedData.education === "string") {
    updatedData.education = JSON.parse(updatedData.education);
  }
  if (typeof updatedData.skills === "string") {
    updatedData.skills = JSON.parse(updatedData.skills);
  }

  const existingJob = await JobService.getSingleJob(id);
  if (!existingJob) {
    // Delete uploaded file if it exists
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  // Check if title is being updated and if it already exists
  if (updatedData.title && updatedData.title !== existingJob.title) {
    const jobWithSameTitle = await JobService.getSingleJobByTitle(
      updatedData.title
    );
    if (jobWithSameTitle) {
      // Delete uploaded file if it exists
      if (req.file) {
        deleteFile(req.file.filename);
      }
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Job with this title already exists"
      );
    }
  }

  // Handle file upload
  if (req.file) {
    // Delete old image if it exists
    if (existingJob.image) {
      const filename = existingJob.image.split("/").pop();
      if (filename) {
        deleteFile(filename);
      }
    }
    updatedData.image = getFileUrl(req.file.filename);
  }

  const result = await JobService.updateJob(id, updatedData);

  sendResponse<IJobPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job updated successfully",
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingJob = await JobService.getSingleJob(id);
  if (!existingJob) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  // Delete associated image file if it exists
  if (existingJob.image) {
    const filename = existingJob.image.split("/").pop();
    if (filename) {
      deleteFile(filename);
    }
  }

  const result = await JobService.deleteJob(id);

  sendResponse<IJobPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted successfully",
    data: result,
  });
});

export const JobController = {
  createJob,
  getSingleJob,
  getAllJobs,
  updateJob,
  deleteJob,
};
