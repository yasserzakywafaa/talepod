import { CSSProperties } from "react";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    display: CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: CSSProperties;
  }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    magic: true;
  }
}
declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    badge: true;
  }
}

export const white = "#FFFFFF";

const brand = {
  honey: {
    200: "#FADA99",
    300: "#F5C66D", // PRIMARY (dark)
    400: "#F0B648", // PRIMARY (light)
    500: "#DD9812",
    600: "#BB7400",
    700: "#915200",
  },
  twilight: {
    200: "#D0CAFD",
    300: "#A7A0EC",
    400: "#827CD4",
    500: "#6664C0", // SECONDARY
    600: "#4C4C9E",
  },
  plum: {
    300: "#6D6F89",
    400: "#464B68",
    600: "#171C3B", // card bg (dark)
    700: "#0A0E2B", // page bg (dark)
    800: "#03051B",
  },
  parchment: {
    100: "#FAF4EA", // page bg (light)
    200: "#F2EADD", // card bg (light)
    300: "#E4D9C9", // border (light)
  },
} as const;

/** Semantic tokens — resolved per theme mode. */
const semantic = {
  light: {
    fg: brand.plum[700],
    fg2: brand.plum[400],
    fg3: brand.plum[300],
    surface: white,
    surface2: brand.parchment[200],
    border: brand.parchment[300],
    borderStrong: "#C7B49C",
    divider: "#ECE3D6",
    bgSunken: "#F7EDDC",
    primary: brand.honey[400],
    accent: brand.twilight[500],
  },
  dark: {
    fg: "#F9F4EE",
    fg2: "#BEB6A9",
    fg3: "#8A7F6C",
    surface: brand.plum[600],
    surface2: "#202646",
    border: "#2A3051",
    borderStrong: "#454A6E",
    divider: "#212741",
    bgSunken: brand.plum[800],
    primary: brand.honey[300],
    accent: brand.twilight[300],
  },
} as const;

/** Signature honey focus-glow (box-shadow). honey-400 @18% + honey-500 @30%. */
export const glowHoney =
  "0 0 0 6px rgba(240,182,72,0.18), 0 8px 24px rgba(221,152,18,0.3)";
/** Twilight → warm dawn hero gradient. */
export const bgTwilight =
  "linear-gradient(180deg, #111034 0%, #262B65 45%, #B14F42 100%)";
/** Decorative cover gradient (story-card / audio-thumb placeholders). */
export const gradCover = "linear-gradient(160deg, #FFE6A8, #C9B6E8)";
/** Empty-scene placeholder gradient (comic reader / format previews). */
export const gradScene = "linear-gradient(170deg, #343470 0%, #B14F42 100%)";

// ── Brand anchors (named exports — widely imported) ──────────────────────
export const honey200 = brand.honey[200];
export const honey300 = brand.honey[300];
export const honey400 = brand.honey[400];
export const honey500 = brand.honey[500];
export const honey600 = brand.honey[600];
export const honey700 = brand.honey[700];
export const twilight200 = brand.twilight[200];
export const twilight300 = brand.twilight[300];
export const twilight400 = brand.twilight[400];
export const twilight500 = brand.twilight[500];
export const twilight600 = brand.twilight[600];
export const plum300 = brand.plum[300];
export const plum400 = brand.plum[400];
export const plum600 = brand.plum[600];
export const plum700 = brand.plum[700];
export const plum800 = brand.plum[800];
export const parchment100 = brand.parchment[100];
export const parchment200 = brand.parchment[200];
export const parchment300 = brand.parchment[300];

export const fg3Dark = semantic.dark.fg3;
export const surfaceDark = semantic.dark.surface;
export const surface2Dark = semantic.dark.surface2;
export const borderDark = semantic.dark.border;
export const borderStrongDark = semantic.dark.borderStrong;
export const borderStrongLight = semantic.light.borderStrong;
export const bgSunkenDark = semantic.dark.bgSunken;

// ── Backwards-compatible exports (same names, derived values) ─────────────
export const lightGrey = brand.plum[400]; // secondary text on light
export const charcoal = brand.plum[700]; // primary text on light
export const darkCharcoal = brand.plum[600]; // dark surface for dialogs
export const primaryColor = brand.honey[400];
export const primaryColorOpaqueTen = "#F0B6481a"; // honey @ 10%
export const primaryColorOpaqueThirty = "#F0B6484d"; // honey @ 30%
export const secondaryColorForDarkTheme = brand.twilight[300];
export const secondaryColorForLightTheme = brand.twilight[600];
export const darkBackground =
  "radial-gradient(ellipse at top, #14133E 0%, #0A0E2B 60%)"; // dark page bg
export const defaultBackDropFilterBlur = "blur(4px)";

export const theme = createTheme({
  shape: {
    borderRadius: 12,
  },
  palette: {
    primary: {
      main: primaryColor,
      light: honey300,
      dark: honey600,
      contrastText: white,
    },
    secondary: {
      main: secondaryColorForDarkTheme,
    },
  },
  typography: {
    fontFamily: "'Lexend Deca', LexendDeca, system-ui, sans-serif",
    display: {
      fontFamily: "'Yeseva One', 'Cormorant Garamond', Georgia, serif",
      fontWeight: 400,
      lineHeight: 1.08,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: { display: "h2" },
      },
    },
    // Small uppercase pill — <Chip variant="badge" /> (default honey,
    // color="secondary" → twilight). Replaces the old v2 Badge.
    MuiChip: {
      variants: [
        {
          props: { variant: "badge" },
          style: {
            height: "auto",
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            backgroundColor: honey400,
            color: "#fff",
            "& .MuiChip-label": { padding: "3px 8px" },
          },
        },
        {
          props: { variant: "badge", color: "secondary" },
          style: {
            backgroundColor: twilight500,
            color: "#fff",
          },
        },
      ],
    },
    // Segmented control look (<ToggleButtonGroup>) — replaces the old v2
    // Segmented; honey selected pill.
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: 999,
          padding: 4,
          border: `1px solid ${theme.palette.divider}`,
          gap: 4,
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          fontWeight: 600,
          padding: "6px 16px",
          color: theme.palette.text.secondary,
          "&.Mui-selected": {
            backgroundColor: honey400,
            color: "#fff",
            "&:hover": { backgroundColor: honey400 },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-sm)",
        }),
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
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          borderRadius: 14,
          fontWeight: 600,
          "&.Mui-disabled": {
            opacity: "0.7",
            cursor: "not-allowed",
            backgroundColor: primaryColor,
          },
        },
      },
      // Gradient "magic" CTA — <Button variant="magic"> (replaces v2 Btn magic).
      variants: [
        {
          props: { variant: "magic" },
          style: {
            background: `linear-gradient(135deg, ${honey400}, ${twilight500})`,
            color: "#fff",
            borderRadius: 999,
            boxShadow: "var(--shadow-md)",
            "&:hover": { filter: "brightness(1.04)" },
          },
        },
      ],
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
      default: parchment100, // warm parchment cream
      paper: white,
    },
    text: {
      primary: charcoal, // plum ink
      secondary: lightGrey,
    },
    divider: parchment300,
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: secondaryColorForLightTheme,
          fontFamily: "'Lexend Deca', LexendDeca, sans-serif",
          fontWeight: 700,
          "&:visited": {
            color: secondaryColorForLightTheme,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          backgroundColor: white,
          backgroundImage: "unset",
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "14px",
          border: `1px solid ${parchment300}`,
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
    primary: {
      main: honey300, // brighter honey reads better on plum
      light: brand.honey[200],
      dark: honey400,
      contrastText: plum800,
    },
    background: {
      default: plum700, // page bg dark — deep navy-indigo (design plum-700)
      paper: plum600, // card/dialog surface
    },
    text: {
      primary: semantic.dark.fg, // warm white
      secondary: semantic.dark.fg2,
    },
    divider: semantic.dark.border,
  },
  components: {
    ...theme.components,
    MuiLink: {
      styleOverrides: {
        root: {
          color: secondaryColorForDarkTheme,
          fontFamily: "'Lexend Deca', LexendDeca, sans-serif",
          fontWeight: 700,
          "&:visited": {
            color: secondaryColorForDarkTheme,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          backgroundImage: "unset",
          backgroundColor: plum600,
          border: `1px solid ${primaryColor}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "14px",
          border: `1px solid ${twilight500}`,
        },
        list: {
          color: white,
          backgroundColor: plum600,
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
