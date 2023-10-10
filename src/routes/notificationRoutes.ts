import { Router } from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from "../controllers/notificationController";

import { isAuth } from "../middleware/auth";

const router = Router();

router.get("/", isAuth, getNotifications);

router.patch("/read/:id", isAuth, markAsRead);
router.patch("/read-all", isAuth, markAllAsRead);

router.delete("/clear", isAuth, clearNotifications);

export default router;
