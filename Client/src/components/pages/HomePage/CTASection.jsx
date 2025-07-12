import React from "react";
import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

export default function CTASection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ 
       bgcolor: isDark ? theme.palette.background.paper : "#EDE7F6",
        border: isDark ? "1px solid #4B5563" : "none", py: 10, textAlign: "center" }}>
      <Container>
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Ready to Master Your Money?
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Join thousands of users who track smarter, not harder.
        </Typography>
        <Button variant="contained" size="large" color="secondary" component={Link} to='/expenses'>
          Start Tracking Now
        </Button>
      </Container>
    </Box>
  );
}
