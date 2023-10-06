import { Router } from "express";

import {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  deleteManyBookmarks,
} from "../controllers/bookmarkController";

import { isAuth } from "../middleware/auth";

const router = Router();

router.get("/list", isAuth, getBookmarks);
router.get("/view/:id", isAuth, getBookmarkById);

router.post("/create", isAuth, createBookmark);
router.post("/remove-many", isAuth, deleteManyBookmarks);

router.put("/update/:id", isAuth, updateBookmark);

router.delete("/remove/:id", isAuth, deleteBookmark);

export default router;
