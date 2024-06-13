import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#bb86fc", // Indigo
    },
    secondary: {
      main: "#6B8E23", // Olive Green
    },
    background: {
      default: "#F5F5F5", // Light Gray
    },
    text: {
      primary: "#333333", // Charcoal
      secondary: "#666666", // Gray
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#bb86fc", // Indigo
    },
    secondary: {
      main: "#6B8E23", // Olive Green
    },
    background: {
      default: "#333333", // Dark Background
    },
    text: {
      primary: "#FFFFFF", // White
      secondary: "#CCCCCC", // Light Gray
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});
