import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useContact } from "../../hooks/react-query/query-hooks/contact";



const Contact = () => {
  const { mutate, isLoading } = useContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
  
      <Box
        sx={{
          // backgroundColor: "background.default",
          minHeight: "100vh",
          p: 10,
          mt: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 5 }}>
          Contact Us
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Name"
                  fullWidth
                  margin="normal"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label="Subject"
                  fullWidth
                  margin="normal"
                  {...register("subject", { required: "Subject is required" })}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                />
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  {...register("message", { required: "Message is required" })}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Contact Info + Map */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography sx={{ mb: 2 }}>📞 (+91)-304-050-9060</Typography>
                <Typography sx={{ mb: 2 }}>✉️ support@expensetracker.com</Typography>
                <Typography sx={{ mb: 2 }}>
                  📍 Old Super Market, Darjeeling, WB
                </Typography>
                <Typography>🕒 Open 24/7</Typography>
              </Box>
              <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                <iframe
                  title="Darjeeling Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3530.9779601511576!2d88.26285137464595!3d27.037324215049683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e42e70e16583c9%3A0x5a617f7c96f98488!2sDarjeeling%2C%20West%20Bengal%20734101!5e0!3m2!1sen!2sin!4v1719339291123!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
 
  );
};

export default Contact;
