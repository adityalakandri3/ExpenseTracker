import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";


export const resetData = async () => {
  try {
    const { data } = await axiosInstance.delete(endPoints.user.resetData);
    return data; 
  } catch (error) {
    console.error("Error resetting user data:", error.response?.data || error.message);
    throw error; 
  }
};
