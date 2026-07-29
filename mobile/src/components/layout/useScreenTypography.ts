import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

import { useIsAppRtl } from "src/components/layout/useAppLayoutDirection";

/** Theme-aware text styles for marketing and dashboard screens. */
export const useScreenTypography = () => {
  const theme = useTheme();
  const isRtl = useIsAppRtl();
  const textAlign = isRtl ? ("right" as const) : ("left" as const);

  return StyleSheet.create({
    title: { color: theme.colors.onSurface, textAlign },
    body: {
      color: theme.colors.onSurfaceVariant,
      lineHeight: 22,
      textAlign,
    },
    badge: { color: theme.colors.primary, textAlign },
    error: { color: theme.colors.error, textAlign },
  });
};

export const useThemedTextInputProps = () => {
  const theme = useTheme();
  const isRtl = useIsAppRtl();
  const textAlign = isRtl ? ("right" as const) : ("left" as const);

  return {
    outlineColor: theme.colors.outline,
    activeOutlineColor: theme.colors.primary,
    textColor: theme.colors.onSurface,
    textAlign,
    contentStyle: { textAlign },
  };
};

export const useBrandButtonColors = () => {
  const theme = useTheme();
  return {
    contained: theme.colors.primary,
    onContained: theme.colors.onPrimary,
    outlined: theme.colors.primary,
  };
};
