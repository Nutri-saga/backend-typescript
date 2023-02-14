import { Response } from "express";

//Response class => to handle own response.
export default class ResponseImpl {
  //constructor
  constructor(private statusCode: number, private data: Object) {}

  //send method => to send response back to client with status code and data.
  send(res: Response) {
    return res.status(this.statusCode).json(this.data);
  }
}
