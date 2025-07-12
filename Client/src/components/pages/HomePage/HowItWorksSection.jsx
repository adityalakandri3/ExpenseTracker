import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Slide,
  useTheme,
} from "@mui/material";

const steps = [
  {
    step: "1",
    title: "Create Account",
    desc: "Sign up in seconds and set up your financial goals.",
  },
  {
    step: "2",
    title: "Add Expenses",
    desc: "Quickly input expenses by category or upload receipts.",
  },
  {
    step: "3",
    title: "View Insights",
    desc: "See where your money goes and adjust your habits.",
  },
];

export default function HowItWorksSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: isDark ? theme.palette.background.default : "#F9FAFB",
        border: isDark ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <Container>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          color="primary"
          gutterBottom
        >
          How It Works
        </Typography>
        <Grid container spacing={4} mt={2}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Slide direction="up" in={true} timeout={500 + index * 300}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    border: isDark ? `1px solid ${theme.palette.divider}` : "none",
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    color="secondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    {step.step}
                  </Typography>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mt={1}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
