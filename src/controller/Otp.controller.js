import crypto from "crypto";
import OtpModel from "../model/Otp.model.js";
import { sendSMS } from "../utils/twilio.js";
import { sendMail } from "../utils/nodemailer.js";
import { mail_model } from "../model/mail.model.js";

// generate opt using crypto
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}
// controller to send otp to phone number
const getOtp = async (req, res) => {
  try {
    var { phone } = req.body;

    if (!phone)
      return res.status(404).json({
        message: "Missing Phone Number",
        success: false,
      });

    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { phone },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const message = `Your verification code is ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`;

    await sendSMS(phone, message);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    // await OtpModel.deleteOne({ phone });
    return res.status(500).json({
      message: "User is",
      error,
      success: false,
    });
  }
};
// controller to very=ify otp
const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP required" });

    const record = await OtpModel.findOne({ phone });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP Verified
    await OtpModel.deleteOne({ phone }); // remove after verification
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

const sendMailOtp = async (req, res) => {
  try {
    var { email: to } = req.body;

    const otp = generateOtp();

    const subject = "Verify Your mail";

    const message = `Your verification code is ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`;

    const htmlTemplate = `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #4CAF50; text-align: center;">Your OTP Code</h2>
              <p style="font-size: 16px; color: #333;">
                Hello, <br /><br />
                Please use the following One Time Password (OTP) to verify your action:
              </p>
              <div style="font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; color: #000;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #555;">
                This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.
              </p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #888; text-align: center;">
                &copy; ${new Date().getFullYear()} HRMS System. All rights reserved.
              </p>
            </div>
          </div>
        `;

    await sendMail({ to, subject, html: htmlTemplate });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const saveInDb = await mail_model.create({
      otp,
      expiresAt,
      mail: to,
    });

    // console.log(saveInDb);
    if (!saveInDb) {
      return res.status(500).json({
        message: "something went wrong",
      });
    }

    res.json({
      message: "Mail sent",
      success: true,
      saveInDb,
    });
  } catch (error) {
    await mail_model.deleteOne({ mail: email });
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const verifyMailOtp = async (req, res) => {
  var { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  try {
    const record = await mail_model.findOne({ mail: email });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    //  OTP Verified
    await mail_model.deleteOne({ mail: email }); // remove after verification
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    await mail_model.deleteOne({ mail: email });
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

export { getOtp, verifyOtpController, sendMailOtp, verifyMailOtp };
