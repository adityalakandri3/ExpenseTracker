import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const createBudget = async (input) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.budget.createBudget,
      input
    );
    return data;
  } catch (error) {
    console.error(
      "Error creating budget:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBudgets = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.budget.getBudgets);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getBudgetsById = async (id) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.budget.getBudgetsById(id)
    );
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updatebudgets = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.budget.updateBudgets(id),
      updatedData
    );
    return data;
  } catch (error) {
    console.error(
      "Error updating budget:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteBudgets = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      endPoints.budget.deleteBudgets(id)
    );
    return data;
  } catch (error) {
    console.error(
      "Error deleting budget:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getBudgetsSummary = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.budget.getBudgetSummary);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};