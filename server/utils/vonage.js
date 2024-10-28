import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export const sendOtp = async (phoneNumber, otp) => {
  const from = "InvenSafe Monitor";
  const text = `Your verification code is: ${otp}`;

  try {
    const response = await vonage.message.sendSms(from, phoneNumber, text);
    console.log("OTP sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
