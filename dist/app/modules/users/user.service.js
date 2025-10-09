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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constants_1 = require("./user.constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const create = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.isUserExist(userData.email);
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const user = yield user_model_1.User.create(userData);
    // Return user without password
    const createdUser = yield user_model_1.User.findById(user._id).select("-password");
    return createdUser;
});
const getUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constants_1.UserSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Dynamic sort needs  fields to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // If there is no condition , put {} to give all data
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // const teachers = await Teacher.find(whereConditions).sort(sortConditions)
    const result = yield user_model_1.User.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield user_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email: email });
    return result;
});
const getSingleUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
    return result;
});
const updateUserPassword = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    console.log("password", newPassword);
    if (typeof newPassword !== "string" || newPassword.trim().length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password must be a non-empty string");
    }
    // Ensure salt rounds is a valid number, default to 12 if not
    let saltRounds;
    try {
        saltRounds = Number(config_1.default.bycrypt_salt_rounds);
        if (isNaN(saltRounds) || saltRounds < 1) {
            saltRounds = 12;
        }
    }
    catch (error) {
        saltRounds = 12;
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true, runValidators: true }).select("-password");
    return updatedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id).select("-password");
    return result;
});
exports.UserService = {
    create,
    getUsers,
    getSingleUser,
    getSingleUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};
