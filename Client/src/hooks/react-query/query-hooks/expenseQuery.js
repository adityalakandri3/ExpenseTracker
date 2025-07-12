import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { toast } from "react-toastify";

import {
  createExpense,
  deleteExpense,
  filterExpenses,
  getExpenses,
  getExpensesById,
  updateExpense,
} from "../../../api/functions/expense";

import { EXPENSE } from "../query-keys/QueryKeys";

// 1. Create Expense
export const useExpenseCreateQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Expense created successfully");
        queryClient.invalidateQueries({ queryKey: [EXPENSE] });
        setTimeout(() => navigate("/expenses"), 1000);
      } else {
        toast.error(data.message || "Expense creation failed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Expense error");
    },
  });
};

// 2. Get All Expenses
export const useGetExpenses = () => {
  return useQuery({
    queryKey: [EXPENSE],
    queryFn: getExpenses,
  });
};

// 3. Delete Expense
export const useDeleteExpenseQuery = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Expense deleted successfully");
        queryClient.invalidateQueries({ queryKey: [EXPENSE] });
      } else {
        toast.error(data.message || "Failed to delete expense");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error occurred during deletion"
      );
    },
  });
};

// 4. Get Expense by ID
export const useGetExpenseById = (id, enabled = true) => {
  return useQuery({
    queryKey: [EXPENSE, id],
    queryFn: () => getExpensesById(id),
    enabled,
  });
};

// 5. Update Expense
export const useUpdateExpenseQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ id, updatedData }) => {
      console.log("Updating Expense:", { id, updatedData });
      return updateExpense(id, updatedData);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Expense updated successfully");
        queryClient.invalidateQueries({ queryKey: [EXPENSE] });
        setTimeout(() => navigate("/expenses"), 1000);
      } else {
        toast.error(data.message || "Failed to update expense");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error occurred while updating"
      );
    },
  });
};


export const useFilterExpenseQuery = (filters) => {
  return useQuery({
    queryKey: [EXPENSE, "filter", filters],
    queryFn: () => filterExpenses(filters),
    enabled: !!filters,
  });
};
