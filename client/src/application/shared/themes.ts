import { createTheme } from "@mui/material/styles";

export const white = "#FFFFFF";
export const lightGrey = "#666666"; // Light Grey
export const charcoal = "#333333"; // Charcoal
export const darkCharcoal = "#121212"; // Dark Charcoal
export const primaryColor = "#ad932d"; // Dark Goldenrod
export const secondaryColorForDarkTheme = "#00BFFF"; // Deep Sky Blue
export const secondaryColorForLightTheme = "#0080ab"; // Dark Deep Sky Blue
export const darkBackground = "linear-gradient(to top, #000000, #2E3B4E)"; // Night Sky

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
          textTransform: "capitalize",
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
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${lightGrey}`,
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "4px",
          backgroundColor: white,
          backgroundImage: "unset",
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${secondaryColorForLightTheme}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          border: `1px solid ${secondaryColorForLightTheme}`,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: secondaryColorForLightTheme,
          textDecoration: "underline",
          textDecorationColor: primaryColor,
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "4px",
          backgroundImage: "unset",
          backgroundColor: darkCharcoal,
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${secondaryColorForDarkTheme}`,
        },
        list: {
          color: white,
          backgroundColor: darkCharcoal,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          border: `1px solid ${secondaryColorForDarkTheme}`,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: secondaryColorForDarkTheme,
          textDecoration: "underline",
          textDecorationColor: primaryColor,
        },
      },
    },
  },
});
