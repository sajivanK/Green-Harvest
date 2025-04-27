// testEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: '8b78db001@smtp-brevo.com',
    pass: '4XEk7m5Hp3haQdt0'
  },
});

async function sendTestMail() {
  try {
    const info = await transporter.sendMail({
      from: 'thayaparanvithu@gmail.com',
      to: "thayaparanvishnuja@gmail.com", // <-- Put your Gmail or real email here
      subject: "Testing Brevo OTP Setup 🚀",
      html: `<h2>This is a test mail to check if SMTP is working!</h2>`,
    });

    console.log("✅ Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email: ", error);
  }
}

sendTestMail();
