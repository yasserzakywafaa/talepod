import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string | number> = {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  /**
   * Colour painted behind the floating label so it can notch the outline.
   * Defaults to the page background; pass `colors.surface` inside a dialog.
   */
  surfaceColor?: string;
};

/**
 * Outlined select with a floating label — the native read of the web's
 * `<TextField select>`: notched outline, chevron affordance, menu on tap.
 */
export const SelectField = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  surfaceColor,
}: SelectFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const theme = useAppTheme();
  const { radius, fontFamily } = theme.tokens;

  const selected = options.find((option) => option.value === value);

  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      anchorPosition="bottom"
      anchor={
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityValue={{ text: selected?.label }}
          style={[
            styles.field,
            {
              borderRadius: radius.md,
              borderColor: open ? theme.colors.primary : theme.colors.outline,
              borderWidth: open ? 2 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.labelWrap,
              { backgroundColor: surfaceColor ?? theme.colors.background },
            ]}
          >
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

          <Text
            numberOfLines={1}
            style={[
              styles.value,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {selected?.label ?? ""}
          </Text>

          <MaterialCommunityIcons
            name="menu-down"
            size={22}
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>
      }
    >
      {options.map((option) => (
        <Menu.Item
          key={String(option.value)}
          title={option.label}
          titleStyle={{
            color:
              option.value === value
                ? theme.colors.primary
                : theme.colors.onSurface,
            fontFamily:
              option.value === value ? fontFamily.semiBold : fontFamily.regular,
          }}
          onPress={() => {
            onChange(option.value);
            setOpen(false);
          }}
        />
      ))}
    </Menu>
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
  value: { flex: 1, fontSize: 16, includeFontPadding: false },
});
