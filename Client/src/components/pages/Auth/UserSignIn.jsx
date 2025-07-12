import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserSignInMutation } from "../../../hooks/react-query/query-hooks/authQuery";
import { Link as RouterLink } from "react-router-dom";


const UserSignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate } = useUserSignInMutation();

  const onSubmit = (data) => {
    console.log("Signing in with data:", data);
    mutate(data);
  };

  return (

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiInputBase-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                "& .MuiInputBase-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4338CA", // darker indigo
                },
              }}
            >
              Sign In
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              {"Don't"} have an account?{" "}
              <Button
                component={RouterLink}
                to="/signup"
                size="small"
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: "bold",
                  p: 0,
                  minWidth: 0,
                }}
              >
                Register
              </Button>
            </Typography>

            <Typography align="center">
              Forgot password?{" "}
              <Button
                component={RouterLink}
                to="/reset-password-link"
                size="small"
                sx={{
                  color: "secondary.main",
                  textTransform: "none",
                  fontWeight: "bold",
                  p: 0,
                  minWidth: 0,
                }}
              >
                Click Here
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>
  
  );
};

export default UserSignIn;
