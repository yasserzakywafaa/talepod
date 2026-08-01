import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type SelectFieldShellProps = {
  label: string;
  /** Drives the focused outline and label colour. */
  open: boolean;
  onPress: () => void;
  // Painted behind the floating label to notch the outline. Pass
  // `colors.surface` inside a dialog or the notch reads as a smudge.
  surfaceColor?: string;
  /** Read out after the label by a screen reader — the current selection. */
  accessibilityValueText?: string;
  /** The selection summary. */
  children: ReactNode;
  /** Chevron, count badge, etc. */
  trailing?: ReactNode;
};

/**
 * The outlined field with a notched floating label, previously copied three
 * times. Only the trigger is shared; what opens below it genuinely differs.
 */
export const SelectFieldShell = ({
  label,
  open,
  onPress,
  surfaceColor,
  accessibilityValueText,
  children,
  trailing,
}: SelectFieldShellProps) => {
  const theme = useAppTheme();
  const { radius, fontFamily } = theme.tokens;
  const fieldBackground = surfaceColor ?? theme.colors.background;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: open }}
      accessibilityValue={
        accessibilityValueText ? { text: accessibilityValueText } : undefined
      }
      style={[
        styles.field,
        {
          borderRadius: radius.md,
          borderColor: open ? theme.colors.primary : theme.colors.outline,
          // The border grows on focus, so pad one less pixel to stop the
          // content shifting by a pixel as it opens.
          borderWidth: open ? 2 : 1,
        },
      ]}
    >
      <View style={[styles.labelWrap, { backgroundColor: fieldBackground }]}>
        <Text
          style={[
            styles.label,
            {
              color: open
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {children}
      {trailing}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: 14,
    gap: 8,
  },
  labelWrap: {
    position: "absolute",
    top: -8,
    left: 10,
    paddingHorizontal: 4,
  },
  label: { fontSize: 12, includeFontPadding: false },
});
