const transporter = require("../config/emailConfig");
const otpVerifyModel = require("../model/OtpModel");

const sendEmailVerificationOtp = async (req, user) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const saveOtp = await otpVerifyModel({ user_id: user._id, otp: otp }).save();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP-Verify your Account",
    html: `<h2>Hi ${user.name},</h2>,
    <p> Your OTP is <strong> ${otp}</strong>.</p>
    <p>Please use it to complete your verification.</p>
    <p>Thank you!</p>`,
  });
  return otp;
};

module.exports = sendEmailVerificationOtp;
