import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const createCategory = async (input) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.category.createCategory,
      input
    );
    return data;
  } catch (error) {
    console.error(
      "Error creating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.category.getcategories);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryById = async (id) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.category.getCategoriesById(id)
    );
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.category.updateCategory(id),
      updatedData
    );
    return data;
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteCategory = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      endPoints.category.deleteCategory(id)
    );
    return data;
  } catch (error) {
    console.error(
      "Error deleting category:",
      error.response?.data || error.message
    );
    throw error;
  }
};
