import Roles from "./Roles";
import { Types } from "mongoose";
import { user } from "../models/user";

// only send the valid user details.
export const getValidUserDetails = (user: user): user => {
  user.password = undefined;

  return user;
};

//function to generate 6 digit otp by default.
export const generateOtp = (
  min: number = 100000,
  max: number = 999999
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//function to define the expiry of otp.
export const otpExpirationTime = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

//function to define the expiry of token.
export const tokenExpirationDate = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

//function to check the email is valid or not.
export const isEmailValid = (email: string): Boolean => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
  else return false;
};

//function to test mobile number.
export const isValidPhone = (phone: string): Boolean => {
  if (/^[6789]\d{9}$/.test(phone)) return true;
  else return false;
};

//to check is the role is valid or not
export const checkRole = (role: Roles): Boolean => {
  return Object.keys(Roles).includes(role);
};

export const isObjectID = (input: string) => {
  if (!Types.ObjectId.isValid(input)) return false;
  const newId = new Types.ObjectId(input);
  return String(newId) === input ? true : false;
};
