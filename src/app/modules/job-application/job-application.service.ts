import { IJobApplication } from "./job-application.interface";
import { JobApplication } from "./job-application.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder, Types } from "mongoose";
import { jobApplicationSearchableFields } from "./job-application.constants";
import { Job } from "../job/job.model";
import { sendJobApplicationEmail } from "../../../shared/email.service";

import path from "path";

const createJobApplication = async (
  payload: IJobApplication
): Promise<IJobApplication | null> => {
  // First, get the job post details to get the contact email
  const jobPost = await Job.findById(payload.jobPost);

  if (!jobPost) {
    throw new Error("Job post not found");
  }

  // Create the application - use the resumePath as provided by controller
  const result = await JobApplication.create(payload);

  // Send email with the application details and resume
  try {
    // Convert the relative path to absolute path for email attachment
    const absolutePath = path.join(
      process.cwd(),
      "public",
      payload.resumePath.startsWith("/")
        ? payload.resumePath.substring(1)
        : payload.resumePath
    );

    const emailSent = await sendJobApplicationEmail(
      jobPost,
      payload,
      absolutePath // Pass the absolute path to the email function
    );

    // Update email status based on the result
    if (emailSent) {
      await JobApplication.findByIdAndUpdate(result._id, {
        emailStatus: "sent",
        emailSentAt: new Date(),
      });
    } else {
      await JobApplication.findByIdAndUpdate(result._id, {
        emailStatus: "failed",
        emailRetries: 1,
        lastEmailError: "Failed to send email",
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    await JobApplication.findByIdAndUpdate(result._id, {
      emailStatus: "failed",
      emailRetries: 1,
      lastEmailError: error instanceof Error ? error.message : String(error),
    });
  }

  return result;
};

// Add email retry function
const retryFailedEmails = async (): Promise<void> => {
  const failedApplications = await JobApplication.find({
    emailStatus: "failed",
    emailRetries: { $lt: 3 }, // Limit retries to 3 times
  }).populate("jobPost");

  for (const application of failedApplications) {
    try {
      const emailSent = await sendJobApplicationEmail(
        application.jobPost,
        application,
        application.resumePath
      );

      if (emailSent) {
        await JobApplication.findByIdAndUpdate(application._id, {
          emailStatus: "sent",
          emailSentAt: new Date(),
          emailRetries: (application.emailRetries ?? 0) + 1, // Use nullish coalescing to default to 0
        });
      } else {
        await JobApplication.findByIdAndUpdate(application._id, {
          emailStatus: "failed",
          emailRetries: (application.emailRetries ?? 0) + 1, // Use nullish coalescing to default to 0
          lastEmailError: "Failed to send email on retry",
        });
      }
    } catch (error) {
      console.error(
        `Error retrying email for application ${application._id}:`,
        error
      );
      await JobApplication.findByIdAndUpdate(application._id, {
        emailStatus: "failed",
        emailRetries: (application.emailRetries ?? 0) + 1,
        lastEmailError: error instanceof Error ? error.message : String(error),
      });
    }
  }
};

const getSingleJobApplication = async (
  id: string
): Promise<IJobApplication | null> => {
  const result = await JobApplication.findById(id).populate("jobPost");
  return result;
};

const getApplicationsByJob = async (
  jobPostId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IJobApplication[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await JobApplication.find({ jobPost: jobPostId })
    .populate("jobPost")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await JobApplication.countDocuments({ jobPost: jobPostId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getApplicationsByEmail = async (
  email: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IJobApplication[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await JobApplication.find({ applicantEmail: email })
    .populate("jobPost")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await JobApplication.countDocuments({ applicantEmail: email });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllJobApplications = async (
  filters: Record<string, any>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IJobApplication[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: jobApplicationSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        if (field === "jobPost" && Types.ObjectId.isValid(value as string)) {
          return { [field]: new Types.ObjectId(value as string) };
        }
        return { [field]: value };
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await JobApplication.find(whereConditions)
    .populate("jobPost")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await JobApplication.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateJobApplication = async (
  id: string,
  payload: Partial<IJobApplication>
): Promise<IJobApplication | null> => {
  const result = await JobApplication.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("jobPost");
  return result;
};

const updateApplicationStatus = async (
  id: string,
  status: IJobApplication["status"]
): Promise<IJobApplication | null> => {
  const result = await JobApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("jobPost");
  return result;
};

const deleteJobApplication = async (
  id: string
): Promise<IJobApplication | null> => {
  const result = await JobApplication.findByIdAndDelete(id);
  return result;
};

export const JobApplicationService = {
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
