import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  useGetBudgets,
  useDeleteBudgetQuery,
  useGetBudgetSummary,
} from "../../hooks/react-query/query-hooks/budgetQuery";

import BudgetTable from "./Budgets/BudgetTable";
import { useNavigate } from "react-router-dom";

const Budgets = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: budgetData = {} } = useGetBudgets();
  const { data: summaryData = {} } = useGetBudgetSummary();
  console.log("Summary",summaryData)

  const navigate = useNavigate();
  const budgets = budgetData?.data || [];
  const summary = summaryData?.data || {};

  const [deleteId, setDeleteId] = useState(null);
  const { mutate, isLoading: isDeleting } = useDeleteBudgetQuery();

  const handleEdit = (budget) => {
    navigate(`/get-budget/${budget._id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const chartData = budgets.map((budget) => ({
    name: budget.category?.name || "N/A",
    Budget: budget.amount,
    Spent: budget.spentAmount,
    Remaining: budget.amount - budget.spentAmount,
  }));

  return (
    <Box p={4} sx={{ mt: 12 }}>
      <Typography variant="h4" align="center" mb={4}>
        Budget Dashboard
      </Typography>


      <Card
      sx={{
        mb: 5,
        p: 2,
        backgroundColor: isDark ? theme.palette.background.paper : "#f5f5f5",
        border: isDark ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Income
            </Typography>
            <Typography variant="h6" color="primary">
              ₹{summary.totalIncome || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Budgeted
            </Typography>
            <Typography variant="h6" color="secondary">
              ₹{summary.totalBudgeted || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Remaining Income
            </Typography>
            <Typography variant="h6" color="error">
              ₹{summary.remaining || 0}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>


   
      <Box height={300} mb={5}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Budget" fill="#4F46E5" />
            <Bar dataKey="Spent" fill="#10B981" />
            <Bar dataKey="Remaining" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-budget")}
        >
          Add Budget
        </Button>
      </Box>


      <BudgetTable
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

   
      <Dialog open={!!deleteId} onClose={cancelDelete}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this budget?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelDelete}
            color="secondary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Budgets;
