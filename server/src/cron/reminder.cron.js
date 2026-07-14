import cron from "node-cron";
import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

const startDailyReminder = () => {
  // Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily reminder cron...");
    try {
      const students = await User.find({ role: "student", isBlocked: false });
      for (const student of students) {
        await sendEmail(
          student.email,
          "Daily SkillForge Reminder",
          `Hi ${student.fullName}, don't forget to update your profile and check new job listings today!`
        );
      }
      console.log(`Reminders sent to ${students.length} students`);
    } catch (error) {
      console.error("Cron job error:", error.message);
    }
  });
};

export default startDailyReminder;
