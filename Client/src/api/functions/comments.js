import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";


export const createComment = async (postId, input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.comment.create(postId), input);
    return data;
  } catch (error) {
    console.error(
      "Error creating comment:",
      error.response?.data || error.message
    )
  }
};



export const getComments = async (postId) => {
  try {
    const { data } = await axiosInstance.get(endPoints.comment.getComments(postId));
    return data;
  } catch (error) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message
    );
    throw error;
  }
};