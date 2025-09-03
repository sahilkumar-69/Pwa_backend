import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: `Your OTP is: "otp"`,
      html,
    });
  } catch (error) {
    throw error;
  }
};
