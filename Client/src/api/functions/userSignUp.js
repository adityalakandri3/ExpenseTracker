
import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const signup = async (input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.signup, input);
    return data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message); 
    throw error;
  }
};

