import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const stats = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.dashboard.stats);
    return data;
  } catch (error) {
    console.log(error);
  }
};

