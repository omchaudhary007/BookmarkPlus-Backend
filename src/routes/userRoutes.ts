import { Router } from "express";

import {
  signup,
  login,
  logout,
  getProfile,
  verifyEmail,
  resendVerification,
  changePassword,
} from "../controllers/userController";

import { isAuth } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", isAuth, changePassword);

router.get("/verify-email", isAuth, verifyEmail);
router.get("/profile", isAuth, getProfile);
router.get("/logout", logout);
router.get("/resend-verification", isAuth, resendVerification);

export default router;
