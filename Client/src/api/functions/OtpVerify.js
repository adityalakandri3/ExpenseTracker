import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const verifyOtp = async (input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.verifyOTP, input);
    return data;
  } catch (error) {
    console.error("OTP verification error:", error.response?.data || error.message);
    throw error;
  }
};
