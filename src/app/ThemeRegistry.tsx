"use client";

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

declare module "@mui/material/styles" {}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#000000",
      light: "#ccc",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },

  typography: {
    allVariants: {
      color: "#262626",
    },
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },

    fontSize: 15,
  },
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
