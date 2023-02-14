export default class ErrorHandler extends Error {
  //constructor with args['status', 'desc']
  constructor(public statusCode: number, public description: string) {
    //calling parent class constructor
    super(description);

    //setting properties related to this class instance
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
