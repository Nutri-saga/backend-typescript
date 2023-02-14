import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";
import userModel, { user } from "../models/user";
import ResponseImpl from "../utils/ResponseImpl";
import bcrypt from "bcrypt";
import { Document } from "mongoose";
import { getValidUserDetails } from "../utils/HelperFunctions";

export default class UserController {
  public static async userSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userDetails: user = req.body as user;

      if (req.body.password !== req.body.confirm_password) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Password and confirm password do not match."
        );
      }

      const { password } = userDetails;

      const hashPassword = await bcrypt.hash(password, 10);

      delete req.body.password;
      delete req.body.confirm_password;
      delete userDetails.password;

      let user: Document = new userModel({
        ...userDetails,
        password: hashPassword,
      });

      user: user = await user.save();

      if (!user) {
        throw new ErrorHandler(httpStatusCodes.BAD_REQUEST, "User not created");
      }

      const response = new ResponseImpl(httpStatusCodes.OK, { user });

      return response.send(res);
    } catch (err) {
      next(err);
    }
  }

  public static async userLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userDetails: user = req.body as user;

      if (req.body.password !== req.body.confirm_password) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Password and confirm password do not match."
        );
      }

      let user: user = await userModel.compare(userDetails);

      user = getValidUserDetails(user);

      const response = new ResponseImpl(httpStatusCodes.OK, {
        msg: "Login Success",
        user,
      });
      response.send(res);
    } catch (error) {
      next(error);
    }
  }
}
