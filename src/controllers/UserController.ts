import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";
import userModel, { user } from "../models/user";
import ResponseImpl from "../utils/ResponseImpl";
import bcrypt from "bcrypt";
import { Document } from "mongoose";
import { getValidUserDetails } from "../utils/HelperFunctions";
import jwt from "jsonwebtoken";

export default class UserController {
  public static async userSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //user details from request's body.
      const userDetails: user = req.body as user;

      //if password 7 c_pass do not match.
      if (req.body.password !== req.body.confirm_password) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Password and confirm password do not match."
        );
      }

      //destructuring password from userdetails for hashing.
      const { password } = userDetails;

      //encrypting password.
      const hashPassword = await bcrypt.hash(password, 10);

      //deleting all passwords.
      delete req.body.password;
      delete req.body.confirm_password;
      delete userDetails.password;

      //creating user.
      let userDoc: Document = new userModel({
        ...userDetails,
        password: hashPassword,
      });

      //user
      let user: any = await userDoc.save();

      //if user not created
      if (!user) {
        throw new ErrorHandler(httpStatusCodes.BAD_REQUEST, "User not created");
      }

      //removing extra details like pass & others from user object.
      user = getValidUserDetails(user as user);

      //response
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
      //user details from request's body.
      const userDetails: user = req.body as user;

      //if pass & c_pass do not match.
      if (req.body.password !== req.body.confirm_password) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Password and confirm password do not match."
        );
      }

      //comparing user password and plain password.
      let user: user = await userModel.compare(userDetails);

      //removing extra details like pass & others from user object.
      user = getValidUserDetails(user);

      //jwt
      const token = jwt.sign(
        { user_id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      //response
      const response = new ResponseImpl(httpStatusCodes.OK, {
        msg: "Login Success",
        user,
        token,
      });
      response.send(res);
    } catch (error) {
      next(error);
    }
  }
}
