import express, { Request, Response } from "express";
//.env config
import { config } from "dotenv";
//database connection
import DBConnection from "./config/db";
//error handler middleware
import ErrorResponse from "./errors/ErrorResponse";
//router
import MasterRouter from "./routers/MasterRouter";
//cross-origin-requests
import cors from "cors";

//cloudinary
import cloudinary from "cloudinary";

//file upload
import fileupload from "express-fileupload";

//path for .env file.
config({ path: "./src/config/config.env" });

//class server
class Server {
  private _app = express();
  private _router = MasterRouter;
  private _dbConnection = DBConnection;

  //return express application
  get app() {
    return this._app;
  }

  //return database connection
  get DBConnection() {
    return this._dbConnection;
  }

  //return router
  get router() {
    return this._router;
  }
}

//instance of server class.
const server = new Server();

//cors
server.app.use(cors());

//config-middleware's
server.app.use(express.json({ limit: "50mb" }));
server.app.use(fileupload());
server.app.use(cors());

//for rendering health status on
server.app.get("/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

//custom-middlewares
server.app.use("/api/v1/", server.router);
server.app.use(ErrorResponse.defaultMethod);

//cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//server's port.
((port = process.env.PORT || 5000) => {
  server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();

//DB connection.
server.DBConnection;
