import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useCreateBlogPost } from "../../../hooks/react-query/query-hooks/blogQuery";
import { useGetBlogCategory } from "../../../hooks/react-query/query-hooks/blogCategoryQuery";

const BlogsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      category: "",
      image: "",
    },
  });

  const { mutate } = useCreateBlogPost();
  const { data: categoryData } = useGetBlogCategory();

  const onSubmit = (form) => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("tags", form.tags);
    formData.append("category", form.category);
    if (form.image && form.image[0]) {
      formData.append("image", form.image[0]);
    }

    mutate(formData);
    reset();
  };

  return (
    <Container sx={{ mt: 10, mb: 10 }}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Create Blog Post
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                {...register("title", { required: true })}
                error={!!errors.title}
                helperText={errors.title && "Title is required"}
              />
            </Grid>

            {/* Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Content"
                {...register("content", { required: true })}
                error={!!errors.content}
                helperText={errors.content && "Content is required"}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                {...register("tags", { required: true })}
                error={!!errors.tags}
                helperText={errors.tags && "Tags are required"}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  defaultValue=""
                  label="Category"
                  {...register("category", { required: true })}
                >
                  {categoryData?.data?.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    Category is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Image */}
            <Grid item xs={12}>
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: "image/*" }}
                {...register("image", { required: true })}
                error={!!errors.image}
                helperText={errors.image && "Image is required"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: "bold" }}
          >
            Submit Blog
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogsForm;
