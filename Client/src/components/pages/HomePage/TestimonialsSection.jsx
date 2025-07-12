import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  useTheme,
} from "@mui/material";

const testimonials = [
  {
    name: "Aditi M.",
    feedback: "This app helped me cut my monthly expenses by 25%! So easy to use.",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Rohit S.",
    feedback: "Beautiful interface and very intuitive. Highly recommend.",
    img: "https://i.pravatar.cc/150?img=12",
  },
];

export default function TestimonialsSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: isDark ? theme.palette.background.default : "#F0F4FF",
        py: 8,
      }}
    >
      <Container>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          gutterBottom
          color="primary"
        >
          What Our Users Say
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={2}>
          {testimonials.map((t, i) => (
            <Grid item xs={12} md={5} key={i}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                  ...(isDark && {
                    border: "1px solid",
                    borderColor: theme.palette.divider,
                  }),
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={t.img} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  “{t.feedback}”
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
