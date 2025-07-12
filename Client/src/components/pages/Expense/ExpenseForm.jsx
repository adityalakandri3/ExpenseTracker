import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useGetCategories } from "../../../hooks/react-query/query-hooks/categoryQuery";
import { useCategoryCreateQuery } from "../../../hooks/react-query/query-hooks/categoryQuery";
import { useExpenseCreateQuery } from "../../../hooks/react-query/query-hooks/expenseQuery";
import { useQueryClient } from "@tanstack/react-query";
import { CATEGORY } from "../../../hooks/react-query/query-keys/QueryKeys";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExpenseCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const { data: categoryData = {} } = useGetCategories();
  const categories = categoryData?.data || [];

  const [isOther, setIsOther] = useState(false);

  const { mutate: createCategory } = useCategoryCreateQuery();
  const { mutate: createExpense } = useExpenseCreateQuery();


  const onSubmit = (data) => {
    if (data.category === "other") {
      const customCat = {
        name: data.customCategoryName,
        type: data.customCategoryType,
      };

      return createCategory(customCat, {
        onSuccess: (res) => {
          if (res.status && res.data?._id) {
            queryClient.invalidateQueries([CATEGORY]);
            toast.info(
              "Custom category created. Please set a budget before adding expenses."
            );
            console.log("before navigating to budget");
            navigate("/create-budget");
          }
        },
      });
    }
    createExpense(data);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15,mb:5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create <span style={{ color: "#10B981" }}>Expense</span>
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              fullWidth
              type="number"
              {...register("amount", { required: "Amount is required" })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type</InputLabel>
              <Select
                defaultValue=""
                {...register("type", { required: true })}
                label="Type"
              >
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="income">Income</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                defaultValue=""
                {...register("category", { required: "Category is required" })}
                onChange={(e) => {
                  setValue("category", e.target.value);
                  setIsOther(e.target.value === "other");
                }}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {isOther && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Custom Category Name"
                  fullWidth
                  {...register("customCategoryName", {
                    required: "Custom category name is required",
                  })}
                  error={!!errors.customCategoryName}
                  helperText={errors.customCategoryName?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category Type</InputLabel>
                  <Select
                    defaultValue=""
                    {...register("customCategoryType", {
                      required: "Category type is required",
                    })}
                    label="Category Type"
                  >
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                  </Select>
                  {errors.customCategoryType && (
                    <Typography variant="caption" color="error">
                      {errors.customCategoryType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField
              type="date"
              label="Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("date", { required: "Date is required" })}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Note (Optional)"
              fullWidth
              multiline
              rows={2}
              {...register("note")}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: "bold", py: 1.5 }}
            >
              Create Expense
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ExpenseCreate;
