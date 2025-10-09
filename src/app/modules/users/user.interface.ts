import { Model, Types } from "mongoose";

export type IUser = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "reporter" | "user";
  language: "en" | "bn";
  phone: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<
    Pick<IUser, "email" | "password" | "role" | "needsPasswordChange">
  >;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
  role?: "admin" | "editor" | "reporter" | "user";
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
};
