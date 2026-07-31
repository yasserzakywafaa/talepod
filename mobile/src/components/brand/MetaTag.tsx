import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type MetaTagProps = {
  label: string;
  /** `secondary` → twilight, `primary` → honey. Mirrors the web outlined chips. */
  tone?: "primary" | "secondary";
};

/** Small outlined chip used in story-card footers (language, date, "Original"). */
export const MetaTag = ({ label, tone = "secondary" }: MetaTagProps) => {
  const theme = useAppTheme();
  const color =
    tone === "primary" ? theme.colors.primary : theme.colors.secondary;

  return (
    <View
      style={[
        styles.tag,
        { borderColor: color, borderRadius: theme.tokens.radius.pill },
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
  tag: {
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 11, includeFontPadding: false },
});
