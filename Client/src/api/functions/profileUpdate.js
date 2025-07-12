import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";


export const profileUpdate = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.updateUser(id), updatedData);
    return data; 
  } catch (error) {
    console.error("Error updating user profile:", error.response?.data || error.message);
    throw error; 
  }
};
