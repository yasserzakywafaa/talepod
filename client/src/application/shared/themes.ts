import { createTheme } from "@mui/material/styles";

export const white = "#FFFFFF";
export const lightGrey = "#666666"; // Light Grey
export const charcoal = "#333333"; // Charcoal
export const darkCharcoal = "#121212"; // Dark Charcoal
export const primaryColor = "#ad932d"; // Dark Goldenrod
export const primaryColorOpaqueTen = "#ad932d1a"; // Dark Goldenrod 10% Opacity
export const primaryColorOpaqueThirty = "#ad932d4d"; // Dark Goldenrod 30% Opacity
export const secondaryColorForDarkTheme = "#00BFFF"; // Deep Sky Blue
export const secondaryColorForLightTheme = "#0080ab"; // Dark Deep Sky Blue
export const darkBackground = "linear-gradient(to top, #000000, #2E3B4E)"; // Night Sky
export const defaultBackDropFilterBlur = "blur(4px)";

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
    MuiSelect: {
      styleOverrides: {
        root: {
          backdropFilter: defaultBackDropFilterBlur,
        },
        outlined: {
          backdropFilter: defaultBackDropFilterBlur,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backdropFilter: defaultBackDropFilterBlur,
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
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backdropFilter: defaultBackDropFilterBlur,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.orientation === "horizontal" && {
            margin: "auto",
            borderColor: "transparent",
            borderBottomWidth: "thin",
            boxShadow: `-9px -2px 1px ${
              theme.palette.mode === "light"
                ? secondaryColorForLightTheme
                : secondaryColorForDarkTheme
            }, 13px 2px 1px ${primaryColor}`,
          }),
          ...(ownerState.orientation === "vertical" && {
            margin: "auto",
            borderColor: "transparent",
            borderBottomWidth: "thin",
            boxShadow: `-2px -5px 1px ${
              theme.palette.mode === "light"
                ? secondaryColorForLightTheme
                : secondaryColorForDarkTheme
            }, 2px 2px 1px ${primaryColor}`,
          }),
        }),
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
      // default: "#2E3B4E", // End color of the gradient - solid for MUI compatibility
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
