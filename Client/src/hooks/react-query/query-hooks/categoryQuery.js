import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import {
  createCategory,
  getCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
} from "../../../api/functions/category";
import { toast } from "react-toastify";
import { CATEGORY } from "../query-keys/QueryKeys";

// Create Category
export const useCategoryCreateQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [CATEGORY] });
        setTimeout(() => navigate("/create-budget"), 1000);
      } else {
        toast.error(data.message || "Category creation failed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Category error");
    },
  });
};

// Get All Categories
export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORY],
    queryFn: getCategories,
  });
};

// Get Category by ID
export const useGetCategoryById = (id, enabled = true) => {
  return useQuery({
    queryKey: [CATEGORY, id],
    queryFn: () => getCategoryById(id),
    enabled,
  });
};

//  Update Category
export const useUpdateCategoryQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ id, updatedData }) => {
      console.log("Updating Category:", { id, updatedData });
      return updateCategory(id, updatedData);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Category updated successfully");
        queryClient.invalidateQueries({ queryKey: [CATEGORY] });
        setTimeout(() => navigate("/categories"), 1000);
      } else {
        toast.error(data.message || "Failed to update category");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Error occurred while updating category"
      );
    },
  });
};

// Delete Category
export const useDeleteCategoryQuery = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: [CATEGORY] });
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Error occurred during category deletion"
      );
    },
  });
};
