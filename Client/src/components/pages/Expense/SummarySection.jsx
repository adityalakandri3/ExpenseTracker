
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

const SummarySection = ({ summary }) => {
  const { totalIncome, totalExpense, remaining, categorySpend } = summary;

  const pieData = categorySpend.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const barData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
    { name: "Remaining", value: remaining },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#10B981", color: "#fff" }}>
            <CardContent>
              <Typography variant="subtitle2">Total Income</Typography>
              <Typography variant="h6">
                <AttachMoney fontSize="small" /> {totalIncome}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#EF4444", color: "#fff" }}>
            <CardContent>
              <Typography variant="subtitle2">Total Expense</Typography>
              <Typography variant="h6">
                <TrendingDown fontSize="small" /> {totalExpense}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#3B82F6", color: "#fff" }}>
            <CardContent>
              <Typography variant="subtitle2">Remaining</Typography>
              <Typography variant="h6">
                <TrendingUp fontSize="small" /> {remaining}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Spend Breakdown */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Category-wise Spending
        </Typography>
        <Grid container spacing={2}>
          {categorySpend.map((cat) => (
            <Grid item xs={12} md={6} key={cat._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2">{cat.category}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹ {cat.amount}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(cat.amount / totalExpense) * 100}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              Expense Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              Financial Summary
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SummarySection;
