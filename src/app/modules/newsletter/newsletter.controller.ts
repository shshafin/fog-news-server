import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NewsletterService } from "./newsletter.service";
import { INewsletter } from "./newsletter.interface";

const subscribeEmail = catchAsync(async (req: Request, res: Response) => {
  const emailData = req.body;
  const result = await NewsletterService.subscribeEmail(emailData);

  sendResponse<INewsletter>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully subscribed to newsletter",
    data: result,
  });
});

const unsubscribeEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await NewsletterService.unsubscribeEmail(email);

  sendResponse<INewsletter>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully unsubscribed from newsletter",
    data: result,
  });
});

const getAllSubscribers = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.getAllSubscribers();

  sendResponse<INewsletter[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscribers retrieved successfully",
    data: result,
  });
});

const getSubscriptionStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;
    const result = await NewsletterService.getSubscriptionStatus(email);

    sendResponse<{ isSubscribed: boolean }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription status retrieved",
      data: result,
    });
  }
);

export const NewsletterController = {
  subscribeEmail,
  unsubscribeEmail,
  getAllSubscribers,
  getSubscriptionStatus,
};
