import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";
import userModel, { user } from "../models/user";
import ResponseImpl from "../utils/ResponseImpl";
import bcrypt from "bcrypt";
import { Document, isValidObjectId } from "mongoose";
import { getValidUserDetails } from "../utils/HelperFunctions";
import jwt from "jsonwebtoken";
import Error404 from "../errors/Error404";
import Roles from "../utils/Roles";

export default class UserController {
  public static async userSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //user details from request's body.
      const userDetails: user = req.body as user;

      //if password & c_pass do not match.
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

  public static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //getting use id to update profile
      const { id } = req.body;

      //if id is not found in request body
      if (!id) {
        throw new Error404("Please enter a valid id.");
      }

      //checking is id valid uuid.
      if (!isValidObjectId(id)) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Please enter a valid uuid"
        );
      }

      //if updating user is not updating his/her profile or user is not admin.
      if (req["user"]._id.toString() !== id && req["user"].role !== Roles.L3) {
        throw new ErrorHandler(
          httpStatusCodes.UN_AUTHORIZED,
          "Unauthorized access to update profile."
        );
      }

      //finding user with given id.
      const userDetails: user = await userModel.findById(id);

      //if user is not found.
      if (!userDetails) {
        throw new Error404(`No user found with id: ${id}`);
      }

      //updated user details
      const updateUserDetails: user = req.body as user;

      //user is not L3 => admin.
      if (req["user"].role !== Roles.L3) req.body.role = undefined;
      //if user is admin check the validated roles.
      else if (!Roles[req.body.role])
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Please enter a valid role of user"
        );
      req.body.username = undefined;
      req.body.password = undefined;

      //updating user profile details
      const updatedUser: user = await userModel.findByIdAndUpdate(
        id,
        updateUserDetails,
        { new: true }
      );

      //if user details not updated
      if (!updateUserDetails) {
        throw new ErrorHandler(
          httpStatusCodes.INTERNAL_SERVER,
          "User details not updated."
        );
      }

      //response
      const response = new ResponseImpl(httpStatusCodes.OK, {
        user: updatedUser,
        msg: "User details updated.",
      });
      response.send(res);
    } catch (err) {
      //Error Handling
      next(err);
    }
  }
}
