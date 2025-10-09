import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IPoll } from "./poll.interface";
import { Poll } from "./poll.model";
import { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { pollSearchableFields } from "./poll.constants";
import { ObjectId } from "mongodb"; 
const createPoll = async (pollData: IPoll): Promise<IPoll> => {
  const isExist = await Poll.findOne({
    title: pollData.title,
    question: pollData.question,
  });

  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Poll already exists with this title and question"
    );
  }

  const createdPoll = await Poll.create(pollData);
  return createdPoll;
};

// Get all polls with filters, pagination, and sorting
const getAllPolls = async (
  filters: Record<string, any>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPoll[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation (title or question)
  if (searchTerm) {
    andConditions.push({
      $or: pollSearchableFields.map((field) => ({
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

  const result = await Poll.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Poll.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSinglePoll = async (id: string): Promise<IPoll | null> => {
  const poll = await Poll.findById(id);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, "Poll not found");
  }
  return poll;
};

const updatePoll = async (
  id: string,
  payload: Partial<IPoll>
): Promise<IPoll | null> => {
  const isExist = await Poll.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Poll not found");
  }

  const { title, question, ...otherData } = payload;

  // Check if updating title/question would cause a duplicate
  if (title || question) {
    const existingPoll = await Poll.findOne({
      title: title || isExist.title,
      question: question || isExist.question,
      _id: { $ne: id },
    });

    if (existingPoll) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Another poll already exists with this title and question"
      );
    }
  }

  const updatedPoll = await Poll.findByIdAndUpdate(id, otherData, {
    new: true,
    runValidators: true,
  });

  return updatedPoll;
};

const deletePoll = async (id: string): Promise<IPoll | null> => {
  const isExist = await Poll.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Poll not found");
  }

  const deletedPoll = await Poll.findByIdAndDelete(id);
  return deletedPoll;
};

const voteForOption = async (
  pollId: string,
  optionId: string
): Promise<IPoll | null> => {
  // Find the poll by its ID
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new ApiError(httpStatus.NOT_FOUND, "Poll not found");
  }

  // Find the option by its ID

const option = poll.options.find((opt) => String(opt._id) === String(optionId));
  if (!option) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid option ID");
  }

  // Increment the vote count for the specified option
  option.votes += 1;
  await poll.save(); // Save the updated poll

  return poll; // Return the updated poll
};

export const PollService = {
  createPoll,
  getAllPolls,
  getSinglePoll,
  updatePoll,
  deletePoll,
  voteForOption,
};
