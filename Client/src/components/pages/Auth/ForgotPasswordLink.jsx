import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useSendResetLink } from "../../../hooks/react-query/query-hooks/authQuery";



const ForgotPasswordLink = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate } = useSendResetLink();

  const onSubmit = (data) => {
    console.log(data);
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
          maxWidth="sm"
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Forgot Password
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Enter Your Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#4338CA", // Slightly darker indigo
                },
              }}
            >
              Send Reset Password Email
            </Button>
          </Box>
        </Container>
      </Box>
  );
};

export default ForgotPasswordLink;
