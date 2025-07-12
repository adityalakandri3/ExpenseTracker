import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CssBaseline,
} from "@mui/material";
import FAQSection from "./FAQPage";

const plans = [
  {
    title: "Free Plan",
    price: "₹0",
    features: [
      "Track daily expenses",
      "Set monthly budget",
      "Basic insights",
      "Manual backups",
    ],
    buttonText: "Get Started",
    buttonVariant: "outlined",
  },
  {
    title: "Pro Plan",
    price: "₹499/month",
    features: [
      "All Free Plan features",
      "Advanced analytics",
      "Cloud backup",
      "Priority support",
    ],
    buttonText: "Upgrade Now",
    buttonVariant: "contained",
  },
];

const PricingPage = () => {
  return (
    <>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ mt: 8, py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Choose the Right Plan for You
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Start for free, upgrade anytime for advanced features.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={5} key={plan.title}>
              <Card
                elevation={plan.buttonVariant === "contained" ? 6 : 2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border:
                    plan.buttonVariant === "contained"
                      ? "2px solid #4F46E5"
                      : "1px solid #ddd",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    borderColor: "#10B981",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" color="text.secondary" gutterBottom>
                    {plan.price}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <Typography variant="body1">{feature}</Typography>
                      </li>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    variant={plan.buttonVariant}
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor:
                          plan.buttonVariant === "contained"
                            ? "#4338CA"
                            : "#E0E7FF",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <FAQSection />
    </>
  );
};

export default PricingPage;
