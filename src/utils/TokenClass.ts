// import jwt from "jsonwebtoken";

// // //entity
// // import { Users } from "../entities/Users";

// // //repo's
// // import UserRepository from "../Repositories/UserRepository";
// // import TokenRepository from "../Repositories/TokenRepository";

// //utils
// import { tokenExpirationDate } from "./HelperFunctions";

// //errors
// import ErrorHandler from "../errors/ErrorHandler";
// import httpStatusCodes from "../errors/HttpCodes";

// //dotenv
// import { config } from "dotenv";
// // import { token, Token } from "../entities/Token";

// //.env config path
// config({ path: "./src/config/config.env" });

// //jwt secret
// const SECRET = process.env.JWT_SECRET;

// class TokenClass {
//   public static async generateToken(user: Users): Promise<string> {
//     //creating a token with user details.
//     const token: string = jwt.sign({ data: { id: user.id } }, SECRET);

//     //defining currentDateTime & expirationDate for token.
//     const currentDateTime: Date = new Date();
//     //(currentDateTime, => no. of days in which token expires)
//     const expirationDate: Date = tokenExpirationDate(currentDateTime, 2);

//     //creating a new tokenfor verified user with expiration date.
//     const newToken = await TokenRepository.save({
//       token,
//       created_at: currentDateTime,
//       expire_at: expirationDate,
//       user_id: user.id,
//     });

//     //storing all tokens of user in this array.
//     let tokenArray: string[] = [];
//     //if user have tokens
//     if (user.tokens) {
//       //add new token into existing array.
//       tokenArray = [...user.tokens, newToken.token];
//     } else {
//       //add new token at index 0.
//       tokenArray = [newToken.token];
//     }

//     //if length of user tokens is greater than 5.
//     if (tokenArray.length > 5) {
//       throw new ErrorHandler(
//         httpStatusCodes.UN_AUTHORIZED,
//         "Device limit exceed"
//       );
//     }

//     //saving user with updated token added.
//     user = await UserRepository.save({
//       ...user,
//       tokens: tokenArray,
//     });

//     return token;
//   }

//   public static async expireToken(token: string): Promise<void> {
//     //finding token details
//     const tokenDetails: Token = await TokenRepository.findOneBy({
//       token: token,
//     });

//     if (!tokenDetails) {
//       throw new ErrorHandler(
//         httpStatusCodes.UN_AUTHORIZED,
//         "Wrong token details"
//       );
//     }

//     //current date & time
//     const currentDateTime: Date = new Date();

//     //expiring the token with current time.
//     await TokenRepository.save({
//       ...tokenDetails,
//       expire_at: currentDateTime,
//     });
//   }
// }

// export = TokenClass;
