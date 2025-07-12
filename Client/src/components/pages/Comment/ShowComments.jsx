import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { useGetCommentsQuery } from "../../../hooks/react-query/query-hooks/commentsQuery";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const ShowComments = ({ postId }) => {
  const { data, isLoading, isError } = useGetCommentsQuery(postId);

  if (!postId) {
    return (
      <Typography color="error" mt={2}>
        Invalid post. Please try again.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.status) {
    return (
      <Typography color="error" mt={2}>
        Failed to load comments.
      </Typography>
    );
  }

  const comments = data?.data ? data.data.slice().reverse() : [];

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {comments.length === 0 ? (
        <Typography>No comments yet. Be the first to comment!</Typography>
      ) : (
        comments.map((comment) => (
          <Box
            key={comment._id}
            mb={2}
            p={2}
            bgcolor="#F9FAFB"
            borderRadius={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" color="text.primary">
                {comment.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({formatDate(comment.createdAt)})
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" mt={1}>
              {comment.content}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default ShowComments;
