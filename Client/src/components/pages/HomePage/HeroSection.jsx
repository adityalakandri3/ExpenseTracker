import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import {Link} from 'react-router-dom'

export default function HeroSection() {
  return (
    <Box sx={{ py: 10, textAlign: "center" ,mt:7}}>
      <Container >
        <Typography variant="h3" fontWeight={700} gutterBottom color="secondary">
          Take Control of Your Spending
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Track your expenses, set budgets, and save smarter — all in one place.
        </Typography>
        <Button variant="contained" size="large" color="primary" component={Link} to='/expenses'>
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
