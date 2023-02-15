import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

//Error
import Error404 from "../errors/Error404";
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";

//functions & models
import userModel, { user } from "../models/user";
import { getValidUserDetails } from "../utils/HelperFunctions";

//Jwt_secret
const SECRET = process.env.JWT_SECRET;

//Jwt Object
type jwtConfig = {
  user_id: string;
  role: string;
  iat: number;
};

export default class VerifyToken {
  public static async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let token = req.headers["authorization"];

      //if no token is found in headers
      if (!token) {
        throw new Error404("Token not foud!");
      }

      //getting actual token.
      token = token.replace("Bearer", "").trimStart();

      //getting user details from token.
      const jwtDetails: jwtConfig = jwt.verify(token, SECRET) as jwtConfig;

      //if token is not verified.
      if (!jwtDetails) {
        throw new ErrorHandler(
          httpStatusCodes.UN_AUTHORIZED,
          "Unauthorized access"
        );
      }

      //getting all user details.
      let user: user = await userModel.findById(jwtDetails.user_id);

      //only valid detils are sended to the next request cycle.
      user = getValidUserDetails(user);

      req["user"] = user;
      next();
    } catch (err) {
      //Error Handling
      next(err);
    }
  }
}
