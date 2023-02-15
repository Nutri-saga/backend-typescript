import { Router } from "express";
import DishController from "../controllers/DishController";
import VerifyToken from "../middlewares/verifyToken";

//master router to handle all routes.
class DishRouter {
  private _router = Router();
  private _dishController = DishController;
  private _authMiddleware = VerifyToken;

  //returns router
  get router() {
    return this._router;
  }

  //default constructor
  constructor() {
    this._configure();
  }

  //method to manage all routes
  private _configure() {
    this.router
      .get("/", this._dishController.getAllDishes)
      .get("/:id", this._dishController.getDishById)
      .post("/", this._authMiddleware.verifyToken, this._dishController.addDish)
      .put(
        "/",
        this._authMiddleware.verifyToken,
        this._dishController.updateDish
      )
      .delete(
        "/",
        this._authMiddleware.verifyToken,
        this._dishController.deleteDishById
      );
  }
}

export = new DishRouter().router;
