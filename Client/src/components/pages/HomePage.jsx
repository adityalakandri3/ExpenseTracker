import React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// Sections
import HeroSection from "./HomePage/HeroSection";
import FeaturesSection from "./HomePage/FeaturesSection";
import HowItWorksSection from "./HomePage/HowItWorksSection";
import BenefitsSection from "./HomePage/BenefitsSection";
import TestimonialsSection from "./HomePage/TestimonialsSection";
import CTASection from "./HomePage/CTASection";

export default function LandingPage() {
  return (
    <>
      <CssBaseline />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
