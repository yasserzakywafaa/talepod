import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type SelectFieldShellProps = {
  label: string;
  /** Drives the focused outline and label colour. */
  open: boolean;
  onPress: () => void;
  /**
   * Colour painted behind the floating label so it notches the outline.
   * Defaults to the page background; pass `colors.surface` inside a dialog,
   * or the label sits on the wrong colour and the notch reads as a smudge.
   */
  surfaceColor?: string;
  /** Read out after the label by a screen reader — the current selection. */
  accessibilityValueText?: string;
  /** The selection summary. */
  children: ReactNode;
  /** Chevron, count badge, etc. */
  trailing?: ReactNode;
};

/**
 * The outlined field with a notched floating label — the native read of the
 * web's `<TextField select>`.
 *
 * This markup was written out three times: twice inside `SelectField` (once
 * for the inline branch and again for the Paper `Menu` anchor) and once in
 * `MultiSelectField`. The copies had already drifted — the multi-select
 * hardcoded the page background where the single select accepted a surface
 * override, so it notched the wrong colour inside a dialog.
 *
 * Only the trigger is shared. What opens underneath it stays with each
 * component, because those genuinely differ: a portaled menu, an inline
 * panel, and a platform action sheet are not the same control.
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
