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
import isVerified from "../middleware/isVerified";

const router = Router();

router.get("/list", isAuth, isVerified, getBookmarks);
router.get("/view/:id", isAuth, isVerified, getBookmarkById);

router.post("/create", isAuth, isVerified, createBookmark);
router.post("/remove-many", isAuth, isVerified, deleteManyBookmarks);

router.put("/update/:id", isAuth, isVerified, updateBookmark);

router.delete("/remove/:id", isAuth, isVerified, deleteBookmark);

export default router;
