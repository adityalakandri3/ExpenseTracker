import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  useDeleteExpenseQuery,
  useFilterExpenseQuery,
} from "../../../hooks/react-query/query-hooks/expenseQuery";
import ExpenseFilterSidebar from "./ExpenseFilterSidebar";

const ExpenseTable = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const {
    data = {},
    isLoading,
    isError,
  } = useFilterExpenseQuery(filters, !!Object.keys(filters).length);
  const { mutate: deleteExpense } = useDeleteExpenseQuery();
  const expenses = data?.data || [];

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const handleEdit = (id) => navigate(`/edit-expense/${id}`);
  const handleOpenDialog = (id) => {
    setSelectedExpenseId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExpenseId(null);
  };
  const handleDelete = () => {
    if (selectedExpenseId) {
      deleteExpense(selectedExpenseId);
      handleCloseDialog();
    }
  };

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Paginated expenses
  const paginatedExpenses = expenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box mt={10} p={3} display="flex" gap={2}>
      <Box width={250}>
        <ExpenseFilterSidebar
          onApplyFilter={(f) => setFilters(f)}
          onClear={() => setFilters({})}
        />
      </Box>

      <Box flexGrow={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Expenses</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/create-expense")}
          >
            Add Expense
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : isError || !data?.status ? (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h6" color="error">
              Failed to load expenses.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense, index) => (
                    <TableRow key={expense._id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{expense.category?.name || "N/A"}</TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>₹{expense.amount}</TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(expense._id)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDialog(expense._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={expenses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExpenseTable;
