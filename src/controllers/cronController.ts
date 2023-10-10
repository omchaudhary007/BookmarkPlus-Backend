import { Request, Response } from "express";

import { User } from "../models/User";
import { Bookmark } from "../models/Bookmark";
import { ReminderNotification } from "../models/ReminderNotification";

import { sendEmail } from "../utils/resend";
import { getNextDue, ReminderType } from "../utils/reminder";
import { env } from "../config/env";
import { reminderEmailTemplate } from "../utils/mailTemplate";

function getTodayRange() {
  const now = new Date();

  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

export async function runReminders(req: Request, res: Response) {
  try {
    console.log("req received");
    const key = req.headers["x-cron-key"];
    console.log("key: ", key);

    if (key !== env.CRON_SECRET) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const { start, end } = getTodayRange();

    const users = await User.find({
      emailRemindersEnabled: true,
      emailVerified: true,
    });
    let sentCount = 0;

    for (const user of users) {
      const bookmarks = await Bookmark.find({
        userId: user._id,
        reminderEnabled: true,
        status: { $ne: "DONE" },
        nextDue: {
          $gte: start,
          $lt: end,
        },

        $or: [{ lastSentAt: null }, { lastSentAt: { $lt: start } }], // to avoid re-sending
      })
        .sort({ priority: 1 })
        .limit(5);
      console.log("bookmark: ", bookmarks);
      if (bookmarks.length === 0) continue;

      const html = reminderEmailTemplate(bookmarks);

      const mail = await sendEmail(
        user.email,
        "⏰ Your Bookmark Reminders",
        html,
      );

      if (mail.error) continue;

      for (const b of bookmarks) {
        await ReminderNotification.create({
          userId: user._id,
          bookmarkId: b._id,
        });

        const next = getNextDue(
          b.reminderType as ReminderType,
          b.nextDue as Date,
        );

        await Bookmark.findByIdAndUpdate(b._id, {
          lastSentAt: new Date(),

          nextDue: next,

          reminderEnabled:
            b.reminderType === "ONCE" ? false : b.reminderEnabled,
        });
      }

      sentCount++;
    }

    return res.json({
      message: "Reminders processed",
      sent: sentCount,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Cron failed",
    });
  }
}
