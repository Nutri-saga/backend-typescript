import { Router } from "express";
import UserController from "../controllers/UserController";

//master router to handle all routes.
class AuthRouter {
  private _router = Router();
  private _authController = UserController;

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
    this.router.post("/signup", this._authController.userSignUp);
    this.router.post("/signin", this._authController.userLogin);
  }
}

export = new AuthRouter().router;
