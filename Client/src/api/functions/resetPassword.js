import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const resetPassword = async (newdata) => {
  try {
    const { id, token, ...rest } = newdata;
    const url = endPoints.user.resetpass(id, token);
    const { data } = await axiosInstance.post(url, rest);
    console.log("From axios", data);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
