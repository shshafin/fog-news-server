import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createComment = async (payload: IComment): Promise<IComment | null> => {
  const result = await Comment.create(payload);
  return result;
};

// Get all comments for a specific news article with pagination
const getAllCommentByNews = async (
  newsId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IComment[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await Comment.find({ news: newsId })
    .sort({ [sortBy]: sortOrder } as { [key: string]: SortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({ news: newsId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateComment = async (
  id: string,
  payload: Partial<IComment>
): Promise<IComment | null> => {
  const isExist = await Comment.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedComment;
};

// Delete a comment by ID
const deleteComment = async (id: string): Promise<IComment | null> => {
  const result = await Comment.findByIdAndDelete(id);
  return result;
};

export const CommentService = {
  createComment,
  getAllCommentByNews,
  updateComment,
  deleteComment,
};
