import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  CssBaseline,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const faqs = [
  {
    question: "What is ExpenseTracker Pro?",
    answer:
      "ExpenseTracker Pro is a tool that helps you track expenses, manage budgets, and analyze your spending habits.",
  },
  {
    question: "Is the Free plan really free?",
    answer:
      "Yes! The Free plan gives you access to essential features without any cost.",
  },
  {
    question: "Can I upgrade to Pro anytime?",
    answer:
      "Absolutely. You can upgrade to the Pro plan anytime from your dashboard.",
  },
  {
    question: "Will I lose my data if I downgrade?",
    answer:
      "No. Your data is safe, but Pro features will be locked after downgrade.",
  },
];

const FAQSection = () => {
  return (
  <>
      <CssBaseline />
      <Box sx={{ py: 6}}>
        {" "}
        {/* Light Indigo BG */}
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom sx={{mb:4}}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
   </>
  );
};

export default FAQSection;
