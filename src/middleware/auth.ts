import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";
import { IAuthRequest } from "../types/types";

export async function isAuth(
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
