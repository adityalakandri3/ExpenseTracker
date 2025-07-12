// src/components/dashboard/QuickActions.jsx
import React from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { Add, Category, AccountBalanceWallet, AttachMoney } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/create-expense")}
            sx={{ py: 2 }}
          >
            Add Expense
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AttachMoney />}
            color="success"
            onClick={() => navigate("/expense-details")}
            sx={{ py: 2 }}
          >
            Expense Table
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AccountBalanceWallet />}
            color="info"
            onClick={() => navigate("/create-budget")}
            sx={{ py: 2 }}
          >
            Create Budget
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Category />}
            color="secondary"
            onClick={() => navigate("/categories")}
            sx={{ py: 2 }}
          >
            Manage Categories
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickActions;
