import { config } from "dotenv";
import mongoose from "mongoose";

//.env config path
config({ path: "./src/config/config.env" });

class DBConnection {
  //contructor.
  constructor() {
    this.getConnection();
  }

  //postgre:connection
  async mongoDbConnection() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(">> MONGoDB Connected...");
    } catch (error) {
      console.log(">> Error in Database Connection", error);
    }
  }

  //get connection method.
  async getConnection() {
    await this.mongoDbConnection();
  }
}

export = new DBConnection();
