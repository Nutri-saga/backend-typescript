import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./ErrorHandler";

//Error response => to handle all error's.
class ErrorResponse {
  //method to handle error's
  defaultMethod(
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //returning response to client with error message.
    if (!err.message && !err.statusCode) {
      return res.status(500).json({
        err,
      });
    }
    return res.status(err.statusCode || 500).json({
      message: err.message,
      status: err.statusCode,
    });
  }
}

export = new ErrorResponse();
