import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type BrandCardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** Honey border + focus glow, matching the web's selected-card treatment. */
  selected?: boolean;
  /** `flat` drops the shadow — for cards nested inside another surface. */
  variant?: "raised" | "flat";
  style?: StyleProp<ViewStyle>;
};

/**
 * The web V2 card: `background.paper`, 1px divider border, `--r-lg` radius and
 * `--shadow-sm`. Selected state adds the honey ring the choosers use.
 */
export const BrandCard = ({
  children,
  onPress,
  selected = false,
  variant = "raised",
  style,
}: BrandCardProps) => {
  const theme = useAppTheme();
  const { radius, shadow, glowHoney, brand } = theme.tokens;

  const surfaceStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: radius.lg,
    borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
    borderColor: selected ? brand.honey[400] : theme.colors.outlineVariant,
  };

  const elevation =
    variant === "flat" ? undefined : selected ? glowHoney : shadow.sm;

  const content = (
    <View style={[styles.card, surfaceStyle, elevation, style]}>{children}</View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { overflow: "hidden" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.995 }] },
});
