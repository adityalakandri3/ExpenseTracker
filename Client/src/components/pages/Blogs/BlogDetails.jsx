import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useGetPostById,useDeleteBlogPost } from "../../../hooks/react-query/query-hooks/blogQuery";
import CommentForm from "../Comment/CommentForm";
import ShowComments from "../Comment/ShowComments";


const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading, isError } = useGetPostById(id);
  const { mutate: deletePost, isLoading: isDeleting } = useDeleteBlogPost();

  if (isLoading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.status) {
    return (
      <Typography mt={4} color="error" align="center">
        {data?.message || "Failed to fetch blog post."}
      </Typography>
    );
  }

  const post = data.data;
  const imageUrl = post.image
    ? `http://localhost:3006/${post.image.replace(/\\/g, "/")}`
    : "";
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = () => {
    deletePost(post._id, {
      onSuccess: () => {
        setOpenDialog(false);
        navigate("/blogs");
      },
    });
  };

  return (
    <Container sx={{ mt: 12, mb: 8 }}>
      <Button
        onClick={() => navigate("/blogs")}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Back to Blogs
      </Button>

      <Card elevation={3}>
        <Grid container>
          {/* Left - Image */}
          <Grid item xs={12} md={5}>
            {imageUrl && (
              <CardMedia
                component="img"
                image={imageUrl}
                alt={post.title}
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Grid>

          {/* Right - Content */}
          <Grid item xs={12} md={7}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography variant="h4" gutterBottom>
                {post.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Category:</strong> {post.categoryId?.name || "Unknown"}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2} mt={1}>
                {post.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="secondary"
                    size="small"
                  />
                ))}
              </Stack>

              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {post.content}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Author:</strong> {post.author?.name || "Unknown"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {formattedDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Likes:</strong> {post.likes?.length || 0}
                  </Typography>
                </Box>

                <Box mt={{ xs: 2, md: 0 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/blog-update/${post._id}`)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenDialog(true)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this blog post? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <CommentForm postId={id}/>
      <ShowComments postId={id}/>
    </Container>
  );
};

export default BlogDetails;
