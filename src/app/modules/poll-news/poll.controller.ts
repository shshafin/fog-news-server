import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PollService } from "./poll.service";
import { IPoll } from "./poll.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { pollFilterableFields } from "./poll.constants";

const createPoll = catchAsync(async (req: Request, res: Response) => {
  const pollData = req.body;
  const result = await PollService.createPoll(pollData);

  sendResponse<IPoll>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll created successfully",
    data: result,
  });
});

const getAllPolls = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, pollFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PollService.getAllPolls(filters, paginationOptions);

  sendResponse<IPoll[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Polls fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePoll = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PollService.getSinglePoll(id);

  sendResponse<IPoll>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll retrieved successfully",
    data: result,
  });
});

const updatePoll = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await PollService.updatePoll(id, updatedData);

  sendResponse<IPoll>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll updated successfully",
    data: result,
  });
});

const deletePoll = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PollService.deletePoll(id);

  sendResponse<IPoll>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Poll deleted successfully",
    data: result,
  });
});

const voteForOption = catchAsync(async (req: Request, res: Response) => {
  const { pollId, optionId } = req.params;
  const result = await PollService.voteForOption(pollId, optionId);

  sendResponse<IPoll>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vote recorded successfully",
    data: result,
  });
});

export const PollController = {
  createPoll,
  getAllPolls,
  getSinglePoll,
  updatePoll,
  deletePoll,
  voteForOption,
};
