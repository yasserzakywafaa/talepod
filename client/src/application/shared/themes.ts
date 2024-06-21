import { createTheme } from "@mui/material/styles";

const mainColor = "#bb86fc"; // Indigo

export const colorPallets = {
  one: {
    background: {
      default: "#2E3B4E",
      card_Background: "#27374D",
    },
    text: "#FFFFFF",
    button: "#FFAB76",
    accent: "#ad932d",
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: mainColor,
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
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: {
  //       body: {},
  //     },
  //   },
  // },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // main: mainColor,
      main: colorPallets.one.accent,
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
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: {
  //       body: {},
  //     },
  //   },
  // },
});
