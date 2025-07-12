import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const createExpense = async (input) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.expense.createExpense,
      input
    );
    return data;
  } catch (error) {
    console.error(
      "Error creating expense:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.expense.getExpenses);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getExpensesById = async (id) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.expense.getExpensesById(id)
    );
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateExpense = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.expense.updateExpenses(id),
      updatedData
    );
    return data;
  } catch (error) {
    console.error(
      "Error updating expense:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteExpense = async (id) => {
  try {
    const { data } = await axiosInstance.delete(
      endPoints.expense.deleteExpenses(id)
    );
    return data;
  } catch (error) {
    console.error(
      "Error deleting expense:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const filterExpenses = async (filters) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const { data } = await axiosInstance.get(
      `${endPoints.expense.filterExpense}?${query}`
    );
    console.log("Filtered expenses from axios", data);
    return data;
  } catch (error) {
    console.error("Error filtering expenses:", error);
  }
};
