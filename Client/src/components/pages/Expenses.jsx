import React from "react";
import { useStatsQuery } from "../../hooks/react-query/query-hooks/statsQuery";
import { Box, CircularProgress, Typography, Container } from "@mui/material";
import SummarySection from "./Expense/SummarySection";
import QuickActions from "./Expense/QuickActions";

const Expenses = () => {
  const { data, isLoading, isError } = useStatsQuery();

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
          Failed to load stats.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 14, mb: 6 }}>
      <QuickActions/>
      <SummarySection summary={data.summary} />
    </Container>
  );
};

export default Expenses;
