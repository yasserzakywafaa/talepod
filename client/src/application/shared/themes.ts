import { CSSProperties } from "react";
import { createTheme } from "@mui/material/styles";

/* Custom theme tokens (TS augmentation) so plain MUI carries the V2 design:
   a Yeseva `display` Typography variant, a `magic` gradient Button variant,
   and a small uppercase `badge` Chip variant (replaces the old v2 kit). */
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

/* =========================================================================
   TalePod V2 theme bridge.
   The visual source of truth is assets/scss/design-system.css (CSS custom
   properties, oklch). MUI can't reliably do color math on oklch, so this
   file mirrors the key brand anchors as hex and feeds them to the MUI
   palette — keeping every existing MUI-styled page on the new palette.
   The exported constant names are preserved (widely imported) so only their
   VALUES change: e.g. primaryColor flips from dark-goldenrod to honey gold.
   ========================================================================= */

export const white = "#FFFFFF";

// Honey gold (primary) — EXACT sRGB of design oklch --honey-400 / 300 / 500 / 600
export const honey400 = "#F0B648"; // oklch(0.81 0.14 80)  PRIMARY (light)
export const honey300 = "#F5C66D"; // oklch(0.85 0.12 82)  PRIMARY (dark)
export const honey500 = "#DD9812"; // oklch(0.73 0.15 76)
export const honey600 = "#BB7400"; // oklch(0.62 0.14 70)

// Twilight purple (secondary) — EXACT sRGB of design --twilight-300 / 500 / 600
export const twilight300 = "#A7A0EC"; // oklch(0.74 0.11 288)
export const twilight500 = "#6664C0"; // oklch(0.55 0.14 282)
export const twilight600 = "#4C4C9E"; // oklch(0.46 0.13 280)

// Plum dark surfaces — EXACT sRGB of design --plum-600 / 700 / 800 (deep navy-indigo)
export const plum600 = "#171C3B"; // oklch(0.24 0.06 275)  card bg dark
export const plum700 = "#0A0E2B"; // oklch(0.18 0.06 274)  PAGE bg dark
export const plum800 = "#03051B"; // oklch(0.13 0.05 273)

// Parchment light surfaces — EXACT sRGB of design --parchment-100 / 200 / 300
export const parchment100 = "#FAF4EA"; // oklch(0.97 0.015 82)
export const parchment200 = "#F2EADD"; // oklch(0.94 0.02 80)
export const parchment300 = "#E4D9C9"; // oklch(0.89 0.025 78)

// ── Backwards-compatible exports (same names, new values) ────────────────
export const lightGrey = "#464B68"; // plum-400 — secondary text on light (was #666666)
export const charcoal = plum700; // primary text on light (was #333333)
export const darkCharcoal = plum600; // dark surface for dialogs (was #121212)
export const primaryColor = honey400; // was #ad932d — now honey gold
export const primaryColorOpaqueTen = "#F0B6481a"; // honey @ 10%
export const primaryColorOpaqueThirty = "#F0B6484d"; // honey @ 30%
export const secondaryColorForDarkTheme = twilight300; // was #00BFFF
export const secondaryColorForLightTheme = twilight600; // was #0080ab
export const darkBackground =
  "radial-gradient(ellipse at top, #14133E 0%, #0A0E2B 60%)"; // design --bg-storybook (dark): deep indigo → plum-700 navy
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
    // Yeseva display variant (use <Typography variant="display">) — the V2
    // headline serif, applied selectively (h1–h6 stay on Lexend).
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
            backgroundColor: "var(--honey-400)",
            color: "#fff",
            "& .MuiChip-label": { padding: "3px 8px" },
          },
        },
        {
          props: { variant: "badge", color: "secondary" },
          style: {
            backgroundColor: "var(--twilight-500)",
            color: "#fff",
          },
        },
      ],
    },
    // Segmented control look (<ToggleButtonGroup>) — replaces the old v2
    // Segmented; honey selected pill.
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--surface)",
          borderRadius: 999,
          padding: 4,
          border: "1px solid var(--border)",
          gap: 4,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          fontWeight: 600,
          padding: "6px 16px",
          color: "var(--fg-2)",
          "&.Mui-selected": {
            backgroundColor: "var(--honey-400)",
            color: "#fff",
            "&:hover": { backgroundColor: "var(--honey-400)" },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--surface)",
          backgroundImage: "none",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-sm)",
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
            background:
              "linear-gradient(135deg, var(--honey-400), var(--twilight-500))",
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
      light: "#FADA99", // honey-200
      dark: honey400,
      contrastText: plum800,
    },
    background: {
      default: plum700, // page bg dark — deep navy-indigo (design plum-700)
      paper: plum600, // card/dialog surface
    },
    text: {
      primary: "#F9F4EE", // warm white (design dark --fg)
      secondary: "#BEB6A9", // design dark --fg-2
    },
    divider: "#212741", // design dark --divider
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
