import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { isValidEmail, isValidPassword } from "../utils/validators";
import { IAuthRequest } from "../types/types";
import { EmailVerification } from "../models/EmailVerification";
import { sendVerification } from "../utils/resend";

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const record = await EmailVerification.findOne({ token });

    if (!record) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    await User.findByIdAndUpdate(record.userId, {
      emailVerified: true,
      emailRemindersEnabled: true,
    });

    await EmailVerification.deleteOne({
      _id: record._id,
    });

    return res.json({
      message: "Email verified successfully.",
    });
  } catch {
    return res.status(500).json({
      message: "Verification failed",
    });
  }
}

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
    await sendVerification(user._id.toString(), email); // send verification mail
    return res.status(201).json({
      message: "user created successfully",
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
      message: "Login successful",
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

    const { password, ...userData } = req.user.toObject();
    return res.json({
      message: "Profile fetched successfully",
      user: userData,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
}

export async function resendVerification(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.emailVerified) {
      return res.status(400).json({
        message: "Already verified",
      });
    }

    const existing = await EmailVerification.findOne({
      userId: req.user._id,
    });

    if (existing && existing.expiresAt > new Date()) {
      return res.status(400).json({
        message: "Verification already sent. Check your email.",
      });
    }

    const mailStatus = await sendVerification(
      req.user._id.toString(),
      req.user.email,
    );
    if (!mailStatus) {
      return res.status(503).json({
        message: "Email service is down. Try later.",
      });
    }
    return res.json({
      message: "verification sent. checkout your mail.",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to send email",
    });
  }
}

export async function changePassword(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: "Invalid new password",
      });
    }

    const match = await bcrypt.compare(oldPassword, req.user.password);

    if (!match) {
      return res.status(400).json({
        message: "password is incorrect.",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    req.user.password = hashed;
    await req.user.save();

    return res.json({
      message: "Password updated successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update password",
    });
  }
}

export async function toggleEmailReminders(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user.emailRemindersEnabled = !req.user.emailRemindersEnabled;

    await req.user.save();

    return res.json({
      message: req.user.emailRemindersEnabled
        ? "Reminders enabled"
        : "Reminders disabled",
      enabled: req.user.emailRemindersEnabled,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update reminder setting",
    });
  }
}
