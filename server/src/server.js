import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import startDailyReminder from "./cron/reminder.cron.js";

const app = (await import("./app.js")).default;

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  startDailyReminder();
});