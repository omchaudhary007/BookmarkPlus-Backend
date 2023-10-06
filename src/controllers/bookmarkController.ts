import { Response } from "express";

import { Bookmark, IBookmark } from "../models/Bookmark";
import { IAuthRequest } from "../types/types";
import {
  isValidCategory,
  isValidTags,
  isValidNote,
  isValidUrl,
} from "../utils/validators";

export async function createBookmark(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const body = req.body as IBookmark;

    const { title, url, note, category, tags, priority } = body;

    if (!title) {
      return res.status(400).json({
        message: "Title and URL required",
      });
    }
    if (!isValidUrl(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    if (!isValidNote(note)) {
      return res.status(400).json({
        message: "Note too long",
      });
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({
        message: "Category too long",
      });
    }

    if (!isValidTags(tags)) {
      return res.status(400).json({
        message: "Invalid tags",
      });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      title,
      url,
      note,
      category,
      tags,
      priority,
    });

    return res.status(201).json({
      message: "Bookmark created",
      bookmark,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to create bookmark",
    });
  }
}

export async function getBookmarks(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const query: Record<string, any> = {
      userId: req.user._id,
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.q) {
      query.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { url: { $regex: req.query.q, $options: "i" } },
        { note: { $regex: req.query.q, $options: "i" } },
        { category: { $regex: req.query.q, $options: "i" } },
        { tags: { $regex: req.query.q, $options: "i" } },
      ];
    }

    if (req.query.dueToday === "true") {
      const today = new Date().toISOString().split("T")[0];

      query.nextDue = {
        $gte: new Date(today),
        $lt: new Date(`${today}T23:59:59.999Z`),
      };
    }

    const data = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments(query);

    return res.json({
      message: "Bookmarks fetched",
      data,
      total,
      page,
      limit,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch bookmarks",
    });
  }
}

export async function getBookmarkById(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    return res.json({
      message: "Bookmark fetched",
      bookmark,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch bookmark",
    });
  }
}

export async function updateBookmark(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { title, url, note, category, tags, status, priority } =
      req.body as Partial<IBookmark>;

    const updateData: Partial<IBookmark> = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Invalid title",
        });
      }

      updateData.title = title;
    }

    if (url !== undefined) {
      if (!isValidUrl(url)) {
        return res.status(400).json({
          message: "Invalid URL",
        });
      }

      updateData.url = url;
    }

    if (note !== undefined) {
      if (!isValidNote(note)) {
        return res.status(400).json({
          message: "Note too long",
        });
      }

      updateData.note = note;
    }

    if (category !== undefined) {
      if (!isValidCategory(category)) {
        return res.status(400).json({
          message: "Category too long",
        });
      }

      updateData.category = category;
    }

    if (tags !== undefined) {
      if (!isValidTags(tags)) {
        return res.status(400).json({
          message: "Invalid tags",
        });
      }

      updateData.tags = tags;
    }

    if (status !== undefined) {
      if (!["NOT_STARTED", "IN_PROGRESS", "DONE"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      updateData.status = status;
    }

    if (priority !== undefined) {
      if (!["HIGH", "MEDIUM", "LOW"].includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      updateData.priority = priority;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
      });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { $set: updateData },
      { new: true },
    );

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    return res.json({
      message: "Bookmark updated",
      bookmark,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update bookmark",
    });
  }
}

export async function deleteBookmark(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    return res.json({
      message: "Bookmark deleted",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to delete bookmark",
    });
  }
}

// DELETE MANY (SELECT / SELECT ALL)
export async function deleteManyBookmarks(req: IAuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { ids } = req.body as {
      ids: string[];
    };

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No bookmarks selected",
      });
    }

    const result = await Bookmark.deleteMany({
      _id: { $in: ids },
      userId: req.user._id,
    });

    return res.json({
      message: "Bookmarks deleted",
      deletedCount: result.deletedCount,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to delete bookmarks",
    });
  }
}
