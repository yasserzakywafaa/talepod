import { createTheme } from "@mui/material/styles";

const primaryColor = "#ad932d"; // Dark Goldenrod
const secondaryColor = "#00BFFF"; // Deep Sky Blue
const darkBackground = "linear-gradient(to top, #000000, #2E3B4E)"; // Night Sky

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "light",
    background: {
      default: "#F5F5F5", // Light Gray
    },
    text: {
      primary: "#333333", // Charcoal
      secondary: "#666666", // Gray
    },
    divider: "#CCCCCC",
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    background: {
      default: darkBackground,
    },
    text: {
      primary: "#FFFFFF", // White
      secondary: "#CCCCCC", // Light Gray
    },
    divider: "#666666", // Charcoal
  },
});
