import React from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Box } from "@mui/material";
import { useCreateCommentQuery } from "../../../hooks/react-query/query-hooks/commentsQuery";


const CommentForm = ({ postId }) => {
  const { register, handleSubmit, reset } = useForm();
  const createCommentMutation = useCreateCommentQuery(postId);

  const onSubmit = (data) => {
    createCommentMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <TextField
        label="Write a comment..."
        fullWidth
        multiline
        rows={3}
        {...register("content", { required: true })}
        variant="outlined"
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={createCommentMutation.isLoading}
      >
        {createCommentMutation.isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </Box>
  );
};

export default CommentForm;
