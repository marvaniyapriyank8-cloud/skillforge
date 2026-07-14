import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text) => {
  // FIX: Don't crash app if email fails - just log it
  try {
    await transporter.sendMail({
      from: `"SkillForge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<div style="font-family:sans-serif;padding:20px;">
        <h2 style="color:#4f46e5;">SkillForge</h2>
        <p>${text}</p>
        <hr/>
        <small style="color:#888;">SkillForge - Build Your Future</small>
      </div>`
    });
  } catch (error) {
    console.error("Email send failed:", error.message);
    // Don't throw - email failure should not break the main flow
  }
};
