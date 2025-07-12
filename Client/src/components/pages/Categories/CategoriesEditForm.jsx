import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import {
  useGetCategoryById,
  useUpdateCategoryQuery,
} from "../../../hooks/react-query/query-hooks/categoryQuery";

const CategoriesEditForm = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCategoryById(id);
  const category = data?.data;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading: isUpdating } = useUpdateCategoryQuery();

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("type", category.type);
    }
  }, [category, setValue]);

  const onSubmit = (formData) => {
    mutate({ id, updatedData: formData });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !category) {
    return (
      <Typography color="error" align="center" mt={4}>
        Failed to load category.
      </Typography>
    );
  }

  return (
    <Box maxWidth={500} mx="auto" mt={10} p={3} borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={3} textAlign="center">
        Edit Category
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Type"
          select
          fullWidth
          margin="normal"
          defaultValue=""
          {...register("type", { required: "Type is required" })}
          error={!!errors.type}
          helperText={errors.type?.message}
        >
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="income">Income</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isUpdating}
          sx={{ mt: 2 }}
        >
          {isUpdating ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </Box>
  );
};

export default CategoriesEditForm;
