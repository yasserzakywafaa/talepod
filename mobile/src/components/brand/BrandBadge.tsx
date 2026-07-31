import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type BrandBadgeProps = {
  label: string;
  /** `primary` → honey, `secondary` → twilight. Mirrors web `Chip variant="badge"`. */
  tone?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
};

/**
 * Small uppercase pill — the web `<Chip variant="badge" />`: 10px, 700 weight,
 * 0.05em tracking, 6px radius, white on honey (or twilight).
 */
export const BrandBadge = ({
  label,
  tone = "primary",
  style,
}: BrandBadgeProps) => {
  const theme = useAppTheme();
  const background =
    tone === "primary"
      ? theme.tokens.brand.honey[400]
      : theme.tokens.brand.twilight[500];

  return (
    <View style={[styles.badge, { backgroundColor: background }, style]}>
      <Text
        style={[styles.label, { fontFamily: theme.tokens.fontFamily.bold }]}
        numberOfLines={1}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 10,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});
