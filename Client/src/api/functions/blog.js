import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

// Create Blog Post
export const createPost = async (input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.blog.createpost, input);
    return data;
  } catch (error) {
    console.error(
      "Error creating blog post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get All Blog Posts
export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.blog.getpost);
    return data;
  } catch (error) {
    console.error(
      "Error fetching blog posts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get Blog Post by ID
export const getPostById = async (id) => {
  try {
    const { data } = await axiosInstance.get(endPoints.blog.getPostById(id));
    return data;
  } catch (error) {
    console.error(
      "Error fetching blog post by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update Blog Post
export const updatePost = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.blog.updatepost(id),
      updatedData
    );
    return data;
  } catch (error) {
    console.error(
      "Error updating blog post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete Blog Post
export const deletePost = async (id) => {
  try {
    const { data } = await axiosInstance.delete(endPoints.blog.deletepost(id));
    return data;
  } catch (error) {
    console.error(
      "Error deleting blog post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//getBlogCategory
export const getBlogCategory = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.blogCategory.getBlogCategory);
    return data;
  } catch (error) {
    console.error(
      "Error fetching blog category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// filterBlogCategory
export const filterBlogCategory = async (categoryId) => {
  try {
    const { data } = await axiosInstance.get(
      `${endPoints.blogCategory.filterBlogCategory}/${categoryId}`
    );
    return data;
  } catch (error) {
    console.error(
      "Error filtering blog category:",
      error.response?.data || error.message
    );
    throw error;
  }
};
