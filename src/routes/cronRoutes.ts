import { Router } from "express";

import { runReminders } from "../controllers/cronController";

const router = Router();

router.get("/run-reminders", runReminders);

export default router;
