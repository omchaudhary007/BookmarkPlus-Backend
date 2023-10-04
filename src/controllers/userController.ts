import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { isValidEmail, isValidPassword } from "../utils/validators";
import { IAuthRequest } from "../types/types";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({
      message:"user created successfully",
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch {
    return res.status(500).json({
      message: "Signup failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch {
    return res.status(500).json({
      message: "Login failed",
    });
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");

  return res.json({
    message: "Logged out",
  });
}

export async function getProfile(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch {
    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
}
