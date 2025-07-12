import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  CreditCard,
  BarChart,
  Notifications,
  Shield,
} from "@mui/icons-material";

const features = [
  {
    icon: <CreditCard fontSize="large" color="primary" />,
    title: "Expense Logging",
    desc: "Easily record and categorize your daily spending.",
  },
  {
    icon: <BarChart fontSize="large" color="primary" />,
    title: "Visual Reports",
    desc: "Get charts and summaries for better financial decisions.",
  },
  {
    icon: <Notifications fontSize="large" color="primary" />,
    title: "Smart Alerts",
    desc: "Stay on top of your budget with timely reminders.",
  },
  {
    icon: <Shield fontSize="large" color="primary" />,
    title: "Privacy First",
    desc: "Your financial data is encrypted and secure.",
  },
];

export default function FeaturesSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: isDark ? theme.palette.background.paper : "#F9FAFB",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          gutterBottom
          color="secondary"
        >
          Features {"You'll"} Love
        </Typography>
        <Grid container spacing={4} mt={2}>
          {features.map((f, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card
                sx={{
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "transform 0.3s ease",
                  bgcolor: isDark ? theme.palette.background.default : "#ffffff",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box mt={3}>{f.icon}</Box>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    color="secondary"
                  >
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
