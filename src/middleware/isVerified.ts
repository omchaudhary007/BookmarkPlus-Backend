import { NextFunction, Response } from "express";
import { IAuthRequest } from "../types/types";

export default function isVerified(
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;
  if (!user || !user.emailVerified) {
    return res.status(403).json({
      message: "Please verify your email first",
    });
  }
  next();
}
