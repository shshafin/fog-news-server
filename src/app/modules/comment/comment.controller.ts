import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CommentService } from "./comment.service";
import { IComment } from "./comment.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

// Create a new comment
const createComment = catchAsync(async (req: Request, res: Response) => {
  const { news, comment } = req.body;

  const result = await CommentService.createComment({ news, comment });

  sendResponse<IComment>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const getAllCommentByNews = catchAsync(async (req: Request, res: Response) => {
  const { newsId } = req.params;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CommentService.getAllCommentByNews(
    newsId,
    paginationOptions
  );

  sendResponse<IComment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await CommentService.updateComment(id, updatedData);

  sendResponse<IComment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

// Delete a comment by ID
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CommentService.deleteComment(id);

  sendResponse<IComment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const CommentController = {
  createComment,
  getAllCommentByNews,
  updateComment,
  deleteComment,
};
