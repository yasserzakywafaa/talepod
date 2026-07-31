import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
};

/**
 * The web `MuiToggleButtonGroup` override: paper track, 999px radius, 4px
 * padding, divider hairline, honey pill on the selected segment.
 */
export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) => {
  const theme = useAppTheme();
  const { radius, brand, fontFamily } = theme.tokens;

  return (
    <View
      style={[
        styles.track,
        {
          borderRadius: radius.pill,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.segment,
              {
                borderRadius: radius.pill,
                backgroundColor: selected ? brand.honey[400] : "transparent",
                opacity: pressed && !selected ? 0.7 : 1,
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
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: { fontSize: 14, includeFontPadding: false },
});
