import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { id: string };
}
