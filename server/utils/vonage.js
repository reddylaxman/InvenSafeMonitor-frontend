import { Vonage } from "@vonage/server-sdk"; // Import Vonage SDK

const vonage = new Vonage({
  apiKey: "93b9cd85", // Your Vonage API key
  apiSecret: "XqYcPqC8luC9zQN0", // Your Vonage API secret
});

// Function to send an OTP via SMS
export const sendOtp = async (phoneNumber, otp) => {
  const from = "InvenSafe Monitor"; // The sender ID
  const text = `Your verification code is: ${otp}`; // Message text with OTP

  // Add country code '91' to the phone number
  const to = `91${phoneNumber.replace(/^91/, "")}`; // Remove existing country code if present

  // Send the SMS message using Vonage API
  await vonage.sms
    .send({ to, from, text }) // Corrected to use sendSms
    .then((resp) => {
      console.log("OTP sent successfully");
      console.log(resp); // Log response
    })
    .catch((err) => {
      console.log("There was an error sending the message.");
      console.error(err); // Log error
    });
};
