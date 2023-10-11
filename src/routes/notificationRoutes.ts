import { Router } from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from "../controllers/notificationController";

import { isAuth } from "../middleware/auth";
import isVerified from "../middleware/isVerified";

const router = Router();

router.get("/", isAuth, isVerified, getNotifications);

router.patch("/read/:id", isAuth, isVerified, markAsRead);
router.patch("/read-all", isAuth, isVerified, markAllAsRead);

router.delete("/clear", isAuth, isVerified, clearNotifications);

export default router;
