import { Request } from "express";
import { IUser } from "../models/User";

// authenticated request
export interface IAuthRequest extends Request {
  user?: IUser;
}
