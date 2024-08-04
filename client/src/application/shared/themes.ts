import { createTheme } from "@mui/material/styles";

const white = "#FFFFFF";
const charcoal = "#333333"; // Charcoal
const darkCharcoal = "#121212"; // Dark Charcoal
const primaryColor = "#ad932d"; // Dark Goldenrod
const secondaryColorForDarkTheme = "#00BFFF"; // Deep Sky Blue
const secondaryColorForLightTheme = "#0080ab"; // Dark Deep Sky Blue
const darkBackground = "linear-gradient(to top, #000000, #2E3B4E)"; // Night Sky

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColorForDarkTheme,
    },
  },
  typography: {
    fontFamily: "LexendDeca, sans-serif",
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
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            opacity: "0.7",
            cursor: "not-allowed",
            backgroundColor: primaryColor,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    secondary: {
      main: secondaryColorForLightTheme,
    },
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
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: charcoal,
          fontFamily: "LexendDeca-Bold",
          "&:visited": {
            color: charcoal,
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          border: `1px solid ${primaryColor}`,
          backgroundColor: "unset",
          borderRadius: "4px",
        },
      },
    },
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
      secondary: "#FFFFFF", // White
    },
    divider: "#666666", // Charcoal
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: white,
          fontFamily: "LexendDeca-Bold",
          "&:visited": {
            color: white,
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          border: `1px solid ${primaryColor}`,
          backgroundColor: darkCharcoal,
          borderRadius: "4px",
        },
      },
    },
  },
});
