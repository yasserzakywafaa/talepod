import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type InfoChipProps = {
  /** The field name, in the chip's regular weight. */
  label: string;
  /** The value, emphasised — the web renders this inside `<span class="bold">`. */
  value: string;
  tone?: "primary" | "secondary";
};

/**
 * Outlined "Label: **Value**" chip. Unlike `MetaTag` this wraps to as many
 * lines as it needs, since story parameters can be long.
 */
export const InfoChip = ({ label, value, tone = "secondary" }: InfoChipProps) => {
  const theme = useAppTheme();
  const { fontFamily, radius } = theme.tokens;
  const color =
    tone === "primary" ? theme.colors.primary : theme.colors.secondary;

  return (
    <View style={[styles.chip, { borderColor: color, borderRadius: radius.pill }]}>
      <Text style={[styles.text, { color, fontFamily: fontFamily.regular }]}>
        {label}:{" "}
        <Text style={{ fontFamily: fontFamily.bold }}>{value}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: { fontSize: 13, lineHeight: 18, includeFontPadding: false },
});
