import { Router } from "express";

import {
  signup,
  login,
  logout,
  getProfile,
  verifyEmail,
  resendVerification,
} from "../controllers/userController";

import { isAuth } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify-email", isAuth, verifyEmail);
router.get("/profile", isAuth, getProfile);
router.get("/resend-verification", isAuth, resendVerification);

export default router;
