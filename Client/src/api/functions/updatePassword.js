import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";


export const updatePassword = async (password) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.updatePassword,password);
    return data; 
  } catch (error) {
    console.error("Error updating user profile:", error.response?.data || error.message);
    throw error; 
  }
};
