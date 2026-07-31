import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

/**
 * The web dashboard chips are MUI's semantic palette — `success` for an active
 * account, `warning` for an admin, `info` for a regular user, `error` for a
 * banned one. Those colours come from MUI itself rather than TalePod's brand
 * ramps, so they live here (with MUI's own light/dark values) instead of in
 * the design tokens, which mirror the web theme file.
 */
export type AdminChipTone = "success" | "warning" | "info" | "error" | "neutral";

const muiPalette: Record<
  Exclude<AdminChipTone, "neutral">,
  { light: string; dark: string }
> = {
  success: { light: "#2E7D32", dark: "#66BB6A" },
  warning: { light: "#ED6C02", dark: "#FFA726" },
  info: { light: "#0288D1", dark: "#29B6F6" },
  error: { light: "#D32F2F", dark: "#F44336" },
};

type AdminStatusChipProps = {
  label: string;
  tone: AdminChipTone;
};

export const AdminStatusChip = ({ label, tone }: AdminStatusChipProps) => {
  const theme = useAppTheme();

  const backgroundColor =
    tone === "neutral"
      ? theme.colors.surfaceVariant
      : muiPalette[tone][theme.dark ? "dark" : "light"];

  const color =
    tone === "neutral"
      ? theme.colors.onSurfaceVariant
      : theme.dark
        ? "#0A0E2B"
        : "#FFFFFF";

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor, borderRadius: theme.tokens.radius.pill },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { color, fontFamily: theme.tokens.fontFamily.medium },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 11, includeFontPadding: false },
});
