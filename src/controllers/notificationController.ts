import { Response } from "express";

import { ReminderNotification } from "../models/ReminderNotification";
import { IAuthRequest } from "../types/types";

export async function getNotifications(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const notifications = await ReminderNotification.find({
      userId: req.user._id,
    })
      .populate("bookmarkId", "title url priority")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Notifications fetched",
      notifications,
      count: notifications.length,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to load notifications",
    });
  }
}

export async function markAsRead(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const notification = await ReminderNotification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.json({
      message: "Marked as read",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update notification",
    });
  }
}

export async function markAllAsRead(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await ReminderNotification.updateMany(
      {
        userId: req.user._id,
        readAt: { $exists: false },
      },
      { readAt: new Date() },
    );

    return res.json({
      message: "All notifications marked as read",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update notifications",
    });
  }
}

export async function clearNotifications(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await ReminderNotification.deleteMany({
      userId: req.user._id,
    });

    return res.json({
      message: "Notifications cleared",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to clear notifications",
    });
  }
}
