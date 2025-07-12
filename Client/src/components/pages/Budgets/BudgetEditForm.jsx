import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { useGetBudgetById, useUpdateBudgetQuery } from "../../../hooks/react-query/query-hooks/budgetQuery";
import { useGetCategories } from "../../../hooks/react-query/query-hooks/categoryQuery";

const BudgetEditForm = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetBudgetById(id);
  const { data: categoriesData } = useGetCategories();
  const { mutate, isLoading: isUpdating } = useUpdateBudgetQuery();

  const categories = categoriesData?.data?.filter((c) => c.type === "expense") || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data?.data) {
      const budget = data.data;
      setValue("category", budget.category._id);
      setValue("amount", budget.amount);
      setValue("startDate", dayjs(budget.startDate).format("YYYY-MM-DD"));
      setValue("endDate", dayjs(budget.endDate).format("YYYY-MM-DD"));
    }
  }, [data, setValue]);

  const onSubmit = (data) => {
    mutate({ id, updatedData:data });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm" sx={{ mt: 15 ,mb:5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Edit Budget
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          value={watch('category')||''}
          {...register("category", { required: "Category is required" })}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Amount"
          fullWidth
          margin="normal"
          type="number"
          {...register("amount", {
            required: "Amount is required",
            min: 1,
          })}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <TextField
          label="Start Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("startDate", { required: "Start date is required" })}
          error={!!errors.startDate}
          helperText={errors.startDate?.message}
        />

        <TextField
          label="End Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("endDate", { required: "End date is required" })}
          error={!!errors.endDate}
          helperText={errors.endDate?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isUpdating}
          sx={{ mt: 2, py: 1.5 }}
        >
          {isUpdating ? "Updating..." : "Update Budget"}
        </Button>
      </Box>
    </Container>
  );
};

export default BudgetEditForm;
