import { Router } from "express";
import DishRouter from "./DishRouter";

//master router to handle all routes.
class MasterRouter {
  private _router = Router();

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
    this.router.use("/dishes", DishRouter);
  }
}

export = new MasterRouter().router;
