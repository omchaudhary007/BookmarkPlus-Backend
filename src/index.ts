import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import userRoutes from "./routes/userRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import cronRoutes from "./routes/cronRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const app = express();
const PORT = env.PORT || 999;
const MONGO_URI = env.MONGO_URI;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  console.log("yes");
  res.status(200).json("Server is running properly...");
});

app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/notifications", notificationRoutes);

connectDb(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
