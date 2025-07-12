import React, { useState } from "react";
import {
  useDashboard,
  useLogout,
  useResetDataQuery,
} from "../../../hooks/react-query/query-hooks/authQuery";

import {
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { data } = useDashboard();
  const navigate = useNavigate();
  const user = data?.data;

  const imageUrl = user?.image
    ? `https://expensifybackend.onrender.com/${user.image.replace(/\\/g, "/")}`
    : "";

  const logout = useLogout();
  const resetMutation = useResetDataQuery();

  const [openDialog, setOpenDialog] = useState(false);

  const handleReset = () => {
    setOpenDialog(true);
  };

  const confirmReset = () => {
    resetMutation.mutate();
    setOpenDialog(false);
  };

  return (
    <Box sx={{ mt: 15, mb: 5, px: 3 }}>
      <Card
        sx={{
          maxWidth: 700,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center">
              <Avatar
                src={imageUrl}
                alt="Profile"
                sx={{ width: 100, height: 100, bgcolor: "red" }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="text.secondary" gutterBottom>
              {user?.role?.toUpperCase()}
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography>Email: {user?.email}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CallIcon sx={{ mr: 1 }} />
              <Typography>Phone: {user?.phone}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography>
                Location: {user?.location?.city}, {user?.location?.state}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/update-password`)}
          >
            Update Password
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/edit-user/${user?.id}`)}
          >
            Update Profile
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={handleReset}
            disabled={resetMutation.isLoading}
          >
            Reset Data
          </Button>

          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Are you sure you want to reset all your data?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmReset} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
