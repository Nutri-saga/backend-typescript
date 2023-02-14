import { Router } from "express";
import DishController from "../controllers/DishController";

//master router to handle all routes.
class DishRouter {
  private _router = Router();
  private _dishController = DishController;

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
      .post("/", this._dishController.addDish)
      .put("/", this._dishController.updateDish)
      .get("/:id", this._dishController.getDishById)
      .delete("/:id", this._dishController.deleteDishById);
  }
}

export = new DishRouter().router;
