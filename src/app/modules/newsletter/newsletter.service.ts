import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { INewsletter } from "./newsletter.interface";
import { Newsletter } from "./newsletter.model";

const subscribeEmail = async (emailData: INewsletter): Promise<INewsletter> => {
  // Check if email already exists
  const existingSubscription = await Newsletter.findOne({
    email: emailData.email,
  });

  if (existingSubscription) {
    // If exists but unsubscribed, resubscribe
    if (!existingSubscription.isSubscribed) {
      existingSubscription.isSubscribed = true;
      await existingSubscription.save();
      return existingSubscription;
    }
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This email is already subscribed"
    );
  }

  const subscription = await Newsletter.create(emailData);
  return subscription;
};

const unsubscribeEmail = async (email: string): Promise<INewsletter | null> => {
  const subscription = await Newsletter.findOneAndUpdate(
    { email, isSubscribed: true },
    { isSubscribed: false, unsubscribedAt: new Date() },
    { new: true }
  );

  if (!subscription) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Subscription not found or already unsubscribed"
    );
  }

  return subscription;
};

const getAllSubscribers = async (): Promise<INewsletter[]> => {
  return Newsletter.find({ isSubscribed: true });
};

const getSubscriptionStatus = async (
  email: string
): Promise<{ isSubscribed: boolean }> => {
  const subscription = await Newsletter.findOne({ email });

  if (!subscription) {
    return { isSubscribed: false };
  }

  return { isSubscribed: subscription?.isSubscribed ?? false };
};

export const NewsletterService = {
  subscribeEmail,
  unsubscribeEmail,
  getAllSubscribers,
  getSubscriptionStatus,
};
