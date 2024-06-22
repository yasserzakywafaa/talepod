import { createTheme } from "@mui/material/styles";

// const mainColor = "#bb86fc"; // Indigo
const primaryColor = "#ad932d"; // Dark Goldenrod
const secondaryColor = "#00BFFF"; // Deep Sky Blue
const darkBg = "linear-gradient(to top, #000000, #2E3B4E)"; // Night Sky

export const theme = createTheme({
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

export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: "#F5F5F5", // Light Gray
    },
    text: {
      primary: "#333333", // Charcoal
      secondary: "#666666", // Gray
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      // default: "#333333", // Dark Background
      default: darkBg,
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
