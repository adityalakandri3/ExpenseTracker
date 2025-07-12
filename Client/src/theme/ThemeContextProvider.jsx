import React, {  useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ColorModeContext } from "./ColorModeContext";

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("mui-mode");
    if (saved) setMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("mui-mode", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#4F46E5", 
            contrastText: "#fff",
          },
          secondary: {
            main: "#10B981", 
          },
          background: {
            default: mode === "light" ? "#F3F4F6" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1E1E1E",
          },
        },
        typography: {
          fontFamily: "'Montserrat', sans-serif",
          h5: {
            fontWeight: 700,
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
