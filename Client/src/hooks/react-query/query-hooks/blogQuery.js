import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGlobalHooks } from "../../GlobalHooks";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../../../api/functions/blog";

import { BLOG } from "../query-keys/QueryKeys";

// Create Blog Post
export const useCreateBlogPost = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post created successfully");
        queryClient.invalidateQueries({ queryKey: [BLOG] });
        setTimeout(() => navigate("/blogs"), 1000);
      } else {
        toast.error(data.message || "Failed to create post");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error creating post");
    },
  });
};

// Get All Blog Posts
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: [BLOG],
    queryFn: getPosts,
  });
};

// Get Blog Post By ID
export const useGetPostById = (id) => {
  return useQuery({
    queryKey: [BLOG, id],
    queryFn: () => getPostById(id),
  });
};

// Update Blog Post
export const useUpdateBlogPost = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ id, updatedData }) => updatePost(id, updatedData),
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post updated successfully");
        queryClient.invalidateQueries({ queryKey: [BLOG] });
        setTimeout(() => navigate("/blogs"), 1000);
      } else {
        toast.error(data.message || "Failed to update post");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error updating post"
      );
    },
  });
};

// Delete Blog Post
export const useDeleteBlogPost = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post deleted successfully");
        queryClient.invalidateQueries({ queryKey: [BLOG] });
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error deleting post"
      );
    },
  });
};
