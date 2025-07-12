import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const contact = async (newdata) => {
  try {
    const { data } = await axiosInstance.post(endPoints.contact.sendmessage,newdata);
    return data;
  } catch (error) {
    console.error(
      "Error sending message.",
      error.response?.data || error.message
    );
    throw error;
  }
};