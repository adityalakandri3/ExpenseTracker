import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { useGetCategories } from "../../../hooks/react-query/query-hooks/categoryQuery";

const ExpenseFilterSidebar = ({ onApplyFilter, onClear }) => {
  const { data = {} } = useGetCategories();
  const categories = data?.data || [];

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    type: "",
    minAmount: "",
    maxAmount: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    onApplyFilter(cleanedFilters);
  };

  const handleClear = () => {
    setFilters({
      startDate: "",
      endDate: "",
      category: "",
      type: "",
      minAmount: "",
      maxAmount: "",
    });
    onClear();
  };

  return (
    <Box p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        Filter Expenses
      </Typography>

      <TextField
        fullWidth
        label="Start Date"
        name="startDate"
        type="date"
        value={filters.startDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="dense"
      />

      <TextField
        fullWidth
        label="End Date"
        name="endDate"
        type="date"
        value={filters.endDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        margin="dense"
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={filters.category}
          onChange={handleChange}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense">
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          value={filters.type}
          onChange={handleChange}
          label="Type"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="income">Income</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Min Amount"
        name="minAmount"
        type="number"
        value={filters.minAmount}
        onChange={handleChange}
        margin="dense"
      />

      <TextField
        fullWidth
        label="Max Amount"
        name="maxAmount"
        type="number"
        value={filters.maxAmount}
        onChange={handleChange}
        margin="dense"
      />

      <Box mt={2} display="flex" justifyContent="space-between" gap={1}>
        <Button variant="outlined" fullWidth onClick={handleClear}>
          Clear
        </Button>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseFilterSidebar;
