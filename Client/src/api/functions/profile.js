import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const dashboard = async () => {
  try {
    const {data} = await axiosInstance.get(endPoints.user.dashboard);
    console.log("from axios",data)
    return data
  } catch (error) {
    console.log(error);
  }
};
