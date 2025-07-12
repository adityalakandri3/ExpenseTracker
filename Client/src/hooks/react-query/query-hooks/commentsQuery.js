import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { toast } from "react-toastify";
import { createComment, getComments } from "../../../api/functions/comments";
import { COMMENT } from "../query-keys/QueryKeys";


export const useCreateCommentQuery = (postId) => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: (input) => createComment(postId, input),
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Comment posted successfully");
        queryClient.invalidateQueries({ queryKey: [COMMENT, postId] });
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error creating comment");
    },
  });
};


export const useGetCommentsQuery = (postId) => {
  return useQuery({
    queryKey: [COMMENT, postId],
    queryFn: () => getComments(postId),
    
  });
};