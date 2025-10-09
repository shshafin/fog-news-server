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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
        enum: ["admin", "editor", "reporter", "user"],
        default: "user",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        select: 0,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        },
    },
});
UserSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email: email }, { email: 1, password: 1, role: 1, needsPasswordChange: 1 });
    });
};
// Check if password matches
UserSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
// Check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfterJwtIssued = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return jwtTimestamp < changedTimestamp;
    }
    return false;
};
// Hash password before saving
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bycrypt_salt_rounds));
        if (!this.needsPasswordChange && this.isModified("password")) {
            this.passwordChangedAt = new Date();
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
