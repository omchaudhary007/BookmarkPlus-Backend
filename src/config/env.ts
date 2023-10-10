export const env = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "Bookmark+<onboarding@resend.dev>",
  APP_PUBLIC_BASE_URL: process.env.APP_PUBLIC_BASE_URL || "http://localhost:5173",
  CRON_SECRET: process.env.CRON_SECRET || ""
};

