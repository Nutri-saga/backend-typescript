import { NextFunction } from "express";
import { Document, Model, model, Schema, Types } from "mongoose";
import Roles from "../utils/Roles";
import bcrypt from "bcrypt";
import Error404 from "../errors/Error404";
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";

export interface user {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
}

interface userFunctions extends Model<user> {
  compare(userDetails: user): Promise<user>;
}

const userSchema = new Schema<user>(
  {
    name: {
      type: String,
      required: [true, "User's name is required."],
    },
    email: {
      type: String,
      required: [true, "User's email is required."],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "User's phone is required."],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "User's username is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required."],
    },
    role: {
      type: String,
      enum: ["L1", "L2", "L3"],
      default: Roles.L1,
      required: [true, "User's role is required."],
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

userSchema.static(
  "compare",
  async function compare(userDetails: user): Promise<user> {
    const user: user = await userModel.findOne({
      username: userDetails.username,
    });

    //if no user found with username
    if (!user) {
      throw new Error404(
        `No user found with username: ${userDetails.username}`
      );
    }

    //credentials
    const plainText = userDetails.password;
    const hashPassword = user.password;
    const result: boolean = await bcrypt.compare(plainText, hashPassword);

    //if password do not match
    if (!result) {
      throw new ErrorHandler(
        httpStatusCodes.UN_AUTHORIZED,
        "Username or password is incorrect"
      );
    }

    //returning user details
    return user;
  }
);

const userModel = model<user, userFunctions>("User", userSchema);

export default userModel;
