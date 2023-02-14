import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import Error404 from "../errors/Error404";
import httpStatusCodes from "../errors/HttpCodes";
import dishModel, { dish, Img_url } from "../models/dish";
import ResponseImpl from "../utils/ResponseImpl";
import ErrorHandler from "../errors/ErrorHandler";
import { isObjectID } from "../utils/HelperFunctions";

export default class DishController {
  public static async addDish(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;

      //if url is not present in the request body.
      if (!url) {
        throw new Error404("Image url not found.");
      }

      //image upload result
      const uploadResult: Img_url = await cloudinary.v2.uploader.upload(url, {
        folder: "dishes",
        width: 800,
        crop: "scale",
      });

      //if image not uploaded successfully
      if (!uploadResult) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Url entered is invalid."
        );
      }

      //adding image url in req's body.
      req.body.image_url = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };

      //converting req to dish.
      const dishDetails: dish = req.body as dish;

      //creating new dish in db.
      const dish: dish = await dishModel.create(dishDetails);

      //reponse
      const response = new ResponseImpl(httpStatusCodes.CREATED, {
        dish,
        msg: "Dish Created..",
      });
      return response.send(res);
    } catch (err) {
      //error handling
      next(err);
    }
  }

  public static async updateDish(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //destructuring id from req's body
      const { id } = req.body;

      //if id is not valid uuid
      if (!isObjectID(id)) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Please enter a valid uuid."
        );
      }

      //finding dish with given id;
      let dish: dish = await dishModel.findById(id);

      //update dish details object
      const dishDetails: dish = req.body as dish;

      //if dish not found with given id
      if (!dish) {
        throw new Error404(`No dish found with id: ${id}`);
      }

      //updating dish
      dish = await dishModel.findByIdAndUpdate(id, dishDetails, { new: true });

      //reponse
      const response = new ResponseImpl(httpStatusCodes.OK, {
        dish,
        msg: "Dish Updated..",
      });
      return response.send(res);
    } catch (err) {
      next(err);
    }
  }

  public static async getAllDishes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dishes: dish[] = await dishModel.find();
      //reponse
      const response = new ResponseImpl(httpStatusCodes.OK, {
        dishes,
        msg: "All dish fetched...",
      });
      return response.send(res);
    } catch (err) {
      next(err);
    }
  }

  public static async getDishById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //destructuring id from req's body
      const { id } = req.params;

      //if id is not valid uuid
      if (!isObjectID(id)) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Please enter a valid uuid."
        );
      }

      //finding dish with given id
      const dish: dish = await dishModel.findOne({
        _id: id,
      });

      //if dish is not present
      if (!dish) {
        throw new Error404(`No dish found with id: ${id}`);
      }
      //Response
      const response = new ResponseImpl(httpStatusCodes.OK, {
        dish,
        msg: "Dish fetched...",
      });
      return response.send(res);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteDishById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //destructuring id from req's body
      const { id } = req.params;

      //if id is not valid uuid
      if (!isObjectID(id)) {
        throw new ErrorHandler(
          httpStatusCodes.BAD_REQUEST,
          "Please enter a valid uuid."
        );
      }

      //finding dish with given id
      let dish: dish = await dishModel.findOne({
        _id: id,
      });

      //if dish is not present
      if (!dish) {
        throw new Error404(`No dish found with id: ${id}`);
      }

      //deleting dish
      dish = await dishModel.findByIdAndDelete(id);

      //Response
      const response = new ResponseImpl(httpStatusCodes.OK, {
        dish,
        msg: "Dish deleted...",
      });
      return response.send(res);
    } catch (err) {
      next(err);
    }
  }
}
