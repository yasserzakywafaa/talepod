import { Pressable, StyleSheet, Text } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * Selection pill matching the web's honey `ToggleButton`: solid honey with
 * white text when active, quiet surface with a divider border otherwise.
 *
 * This replaces Paper's `<Chip>`, whose Material baseline `secondaryContainer`
 * renders lavender and reads nothing like the web.
 */
export const ChoiceChip = ({
  label,
  selected,
  onPress,
}: ChoiceChipProps) => {
  const theme = useAppTheme();
  const { radius, brand, fontFamily } = theme.tokens;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          borderRadius: radius.pill,
          backgroundColor: selected ? brand.honey[400] : theme.colors.surface,
          borderColor: selected
            ? brand.honey[400]
            : theme.colors.outlineVariant,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          {
            fontFamily: fontFamily.semiBold,
            color: selected ? "#FFFFFF" : theme.colors.onSurfaceVariant,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    gap: 8,
  },
  label: { fontSize: 14, includeFontPadding: false },
});
