import React from "react";
import { Box, Container, Typography, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const TermsOfUsePrivacyPage = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ backgroundColor: "background.default", py: 6 }}>
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Terms of Use & Privacy Policy
          </Typography>

          {/* Terms of Use */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Terms of Use
          </Typography>
          <Typography paragraph>
            By accessing and using this application, you agree to be bound by
            the terms and conditions set forth herein. You must not use the app
            for any unlawful purposes or in a way that may harm, disable, or
            impair the application.
          </Typography>
          <Typography paragraph>
            All content and services are provided “as is” without warranty. We
            reserve the right to update, modify, or discontinue the service at
            any time without notice.
          </Typography>

          {/* Privacy Policy */}
          <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
            Privacy Policy
          </Typography>
          <Typography paragraph>
            We value your privacy. Your personal information such as name,
            email, and location is stored securely and is not shared with any
            third parties without your consent.
          </Typography>
          <Typography paragraph>
            We may use anonymized data to analyze usage trends to improve user
            experience. You can request deletion of your account and associated
            data at any time by contacting support.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4, color: "text.secondary" }}>
            Last updated: June 25, 2025
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default TermsOfUsePrivacyPage;
