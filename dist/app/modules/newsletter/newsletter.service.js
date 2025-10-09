"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const newsletter_model_1 = require("./newsletter.model");
const subscribeEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingSubscription = yield newsletter_model_1.Newsletter.findOne({
        email: emailData.email,
    });
    if (existingSubscription) {
        // If exists but unsubscribed, resubscribe
        if (!existingSubscription.isSubscribed) {
            existingSubscription.isSubscribed = true;
            yield existingSubscription.save();
            return existingSubscription;
        }
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This email is already subscribed");
    }
    const subscription = yield newsletter_model_1.Newsletter.create(emailData);
    return subscription;
});
const unsubscribeEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield newsletter_model_1.Newsletter.findOneAndUpdate({ email, isSubscribed: true }, { isSubscribed: false, unsubscribedAt: new Date() }, { new: true });
    if (!subscription) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Subscription not found or already unsubscribed");
    }
    return subscription;
});
const getAllSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    return newsletter_model_1.Newsletter.find({ isSubscribed: true });
});
const getSubscriptionStatus = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const subscription = yield newsletter_model_1.Newsletter.findOne({ email });
    if (!subscription) {
        return { isSubscribed: false };
    }
    return { isSubscribed: (_a = subscription === null || subscription === void 0 ? void 0 : subscription.isSubscribed) !== null && _a !== void 0 ? _a : false };
});
exports.NewsletterService = {
    subscribeEmail,
    unsubscribeEmail,
    getAllSubscribers,
    getSubscriptionStatus,
};
