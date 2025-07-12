import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetPostById, useUpdateBlogPost } from "../../../hooks/react-query/query-hooks/blogQuery";
import { useGetBlogCategory } from "../../../hooks/react-query/query-hooks/blogCategoryQuery";


const BlogEditForm = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetPostById(id);
  const { data: categoryData } = useGetBlogCategory();
  const post = data?.data;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading: isUpdating } = useUpdateBlogPost();

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("tags", post.tags.join(","));
      setValue("category", post.categoryId?._id || post.categoryId);
    }
  }, [post, setValue]);

  const onSubmit = (formData) => {
    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("content", formData.content);
    updatedData.append("tags", formData.tags);
    updatedData.append("category", formData.category);
    if (formData.image && formData.image[0]) {
      updatedData.append("image", formData.image[0]);
    }

    mutate({ id, updatedData });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !post) {
    return (
      <Typography color="error" align="center" mt={4}>
        Failed to load blog post.
      </Typography>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={10} p={3} borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={3} textAlign="center">
        Edit Blog Post
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          label="Tags (comma separated)"
          fullWidth
          margin="normal"
          {...register("tags", { required: "Tags are required" })}
          error={!!errors.tags}
          helperText={errors.tags?.message}
        />

        <TextField
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register("content", { required: "Content is required" })}
          error={!!errors.content}
          helperText={errors.content?.message}
        />

        <FormControl fullWidth margin="normal" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            defaultValue=""
            {...register("category", { required: "Category is required" })}
            label="Category"
          >
            {categoryData?.data?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography variant="caption" color="error">
              {errors.category.message}
            </Typography>
          )}
        </FormControl>

        <TextField
          type="file"
          fullWidth
          margin="normal"
          {...register("image")}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isUpdating}
          sx={{ mt: 2 }}
        >
          {isUpdating ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </Box>
  );
};

export default BlogEditForm;
