import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const fetchUserProfile = async (id) => {
  try {
    const { data } = await axiosInstance.get(endPoints.user.editUser(id));
    console.log('data from axios',data)
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};
