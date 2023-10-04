import { Router } from "express";

import {
  signup,
  login,
  logout,
  getProfile
} from "../controllers/userController";

import { isAuth } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", isAuth, getProfile);

export default router;
