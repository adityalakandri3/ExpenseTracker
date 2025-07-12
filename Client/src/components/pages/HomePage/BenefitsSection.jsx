import React from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";

export default function BenefitsSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: isDark ? theme.palette.background.paper : "transparent",
        border: isDark ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          gutterBottom
        >
          Why Choose Our App?
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          maxWidth="md"
          mx="auto"
        >
          Unlike spreadsheets or complicated apps, our tracker is built for
          simplicity and clarity. Save time, reduce overspending, and take back
          control of your finances — even if {"you're"} not good with numbers.
        </Typography>
      </Container>
    </Box>
  );
}
