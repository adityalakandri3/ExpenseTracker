import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from "@mui/material";
import {
  Edit,
  Delete,
  Category as CategoryIcon,
} from "@mui/icons-material";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import FlightIcon from "@mui/icons-material/Flight";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import { useDeleteCategoryQuery, useGetCategories } from "../../../hooks/react-query/query-hooks/categoryQuery";
import { useNavigate } from "react-router-dom";

const categoryIcons = {
  Food: <FastfoodIcon fontSize="small" />,
  Travel: <FlightIcon fontSize="small" />,
  "Water Bill": <WaterDropIcon fontSize="small" />,
  "Electricity Bill": <LightbulbIcon fontSize="small" />,
  Salary: <PaymentsIcon fontSize="small" />,
  Shopping: <ShoppingBagIcon fontSize="small" />,
  Rent: <HomeIcon fontSize="small" />,
  Entertainment: <MovieIcon fontSize="small" />,
};

const Categories = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategoryQuery();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = () => {
    if (selectedCategoryId) {
      deleteCategory(selectedCategoryId);
      setOpenDialog(false);
      setSelectedCategoryId(null);
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedCategoryId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategoryId(null);
  };

  const handleEdit = (id) => {
    navigate(`/get-category/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.status) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load categories.
        </Typography>
      </Box>
    );
  }

  const categories = data.data || [];
  const paginatedCategories = categories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <CategoryIcon color="secondary" fontSize="large" />
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Manage Categories
        </Typography>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {categoryIcons[cat.name] ? (
                      categoryIcons[cat.name]
                    ) : (
                      <Tooltip title="Custom Category">
                        <CategoryIcon fontSize="small" color="disabled" />
                      </Tooltip>
                    )}
                    {cat.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={cat.type}
                    color={cat.type === "expense" ? "error" : "success"}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(cat._id)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleOpenDialog(cat._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={categories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
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
    </Container>
  );
};

export default Categories;
