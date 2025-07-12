import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { toast } from "react-toastify";

import {
  createBudget,
  deleteBudgets,
  getBudgets,
  getBudgetsById,
  getBudgetsSummary,
  updatebudgets,
} from "../../../api/functions/budget";

import { BUDGET, BUDGET_SUMMARY } from "../query-keys/QueryKeys";

//  Create Budget
export const useBugdetCreateQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [BUDGET] });
        setTimeout(() => navigate("/budgets"), 1000);
      } else {
        toast.error(data.message || "Budget creation failed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Budget error");
    },
  });
};

//  Get All Budgets
export const useGetBudgets = () => {
  return useQuery({
    queryKey: [BUDGET],
    queryFn: getBudgets,
  });
};

//  Delete Budget
export const useDeleteBudgetQuery = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: deleteBudgets,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Budget deleted successfully");
        queryClient.invalidateQueries({ queryKey: [BUDGET] });
      } else {
        toast.error(data.message || "Failed to delete budget");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error occurred during deletion"
      );
    },
  });
};

//  Get Budget by ID
export const useGetBudgetById = (id, enabled = true) => {
  return useQuery({
    queryKey: [BUDGET, id],
    queryFn: () => getBudgetsById(id),
    enabled,
  });
};

// Update Budget
export const useUpdateBudgetQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ id, updatedData }) => {
      console.log("Mutation Function Input:", { id, updatedData });
      return updatebudgets(id, updatedData);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Budget updated successfully");
        queryClient.invalidateQueries({ queryKey: [BUDGET] });
        setTimeout(() => navigate("/budgets"), 1000);
      } else {
        toast.error(data.message || "Failed to update budget");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error occurred while updating"
      );
    },
  });
};


//Get Budget summary
export const useGetBudgetSummary = () => {
  return useQuery({
    queryKey: [BUDGET_SUMMARY],
    queryFn: getBudgetsSummary,
  });
};