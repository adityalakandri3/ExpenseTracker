// src/components/common/Footer.jsx

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Container,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const pagesLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/" },
  { name: "Transactions", href: "/expenses" },
  { name: "Blogs", href: "/blogs" },
  { name: "Pricing", href: "/pricing" },
];

const helpLinks = [
  { name: "Support", href: "/contact" },
  { name: "FAQs", href: "/pricing" },
  { name: "Terms", href: "/termsofuse" },
  { name: "Privacy", href: "/termsofuse" },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#111827",
        color: "#E5E7EB",
        py: { xs: 8, md: 10 },
        px: 2,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Logo and About */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1.75rem", md: "2rem" } }}
            >
              Expensi<span style={{ color: "#10B981" }}>Fy</span>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem", lineHeight: 1.8 }}>
              A smart way to track your income, expenses, and savings goals in one place.
            </Typography>
          </Grid>

          {/* Pages */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Pages
            </Typography>
            {pagesLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                underline="none"
                sx={{
                  display: "block",
                  color: "#D1D5DB",
                  mb: 1.5,
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(6px)",
                  },
                }}
              >
                {name}
              </Link>
            ))}
          </Grid>

          {/* Help */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Help
            </Typography>
            {helpLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                underline="none"
                sx={{
                  display: "block",
                  color: "#D1D5DB",
                  mb: 1.5,
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#ffffff",
                    transform: "translateX(6px)",
                  },
                }}
              >
                {name}
              </Link>
            ))}
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Connect with us
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography sx={{ fontSize: "1rem" }}>
                support@expensify.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, mt: "2px" }} />
              <Typography sx={{ fontSize: "1rem" }}>
                Old Super Market <br />
                Darjeeling, WB
              </Typography>
            </Box>

            <Box>
              {[FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon].map(
                (Icon, i) => (
                  <IconButton
                    key={i}
                    href="#"
                    sx={{
                      color: "#D1D5DB",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#10B981",
                        transform: "scale(1.15)",
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                )
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6, fontSize: "1rem", color: "#9CA3AF" }}>
          &copy; {new Date().getFullYear()} ExpensiFy. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
