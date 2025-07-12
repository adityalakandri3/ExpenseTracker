import React from "react";
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
import { useBugdetCreateQuery } from "../../../hooks/react-query/query-hooks/budgetQuery";
import { useGetCategories } from "../../../hooks/react-query/query-hooks/categoryQuery";

const BudgetForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data } = useGetCategories();
  const categories = data?.data?.filter((cat) => cat.type === "expense") || [];

  const { mutate } = useBugdetCreateQuery();

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15, mb: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add <span style={{ color: "#10B981" }}>Budget</span>
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                defaultValue=""
                {...register("category", { required: "Category is required" })}
                label="Category"
              >
                {categories.map((cat) => (
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              {...register("amount", { required: "Amount is required" })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Start Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("startDate", { required: "Start date is required" })}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="End Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("endDate", { required: "End date is required" })}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
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
              Create Budget
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BudgetForm;
