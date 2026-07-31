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
  /**
   * Expand options in-place instead of a Paper `Menu`. Use inside React Native
   * `Modal` sheets — portaled menus render behind the modal layer.
   */
  inline?: boolean;
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
  inline = false,
}: SelectFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const theme = useAppTheme();
  const { radius, fontFamily, semantic } = theme.tokens;
  const fieldBackground = surfaceColor ?? theme.colors.background;

  const selected = options.find((option) => option.value === value);

  const field = (
    <Pressable
      onPress={() => setOpen((previous) => !previous)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: open }}
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
        name={inline && open ? "menu-up" : "menu-down"}
        size={22}
        color={theme.colors.onSurfaceVariant}
      />
    </Pressable>
  );

  if (inline) {
    return (
      <View style={styles.block}>
        {field}
        {open ? (
          <View
            style={[
              styles.panel,
              {
                borderRadius: radius.md,
                backgroundColor: semantic.surface2,
              },
            ]}
          >
            {options.map((option) => {
              const selectedOption = option.value === value;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: selectedOption }}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: selectedOption
                        ? theme.colors.primaryContainer
                        : "transparent",
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      selectedOption
                        ? "check-circle"
                        : "checkbox-blank-circle-outline"
                    }
                    size={18}
                    color={
                      selectedOption
                        ? theme.colors.primary
                        : theme.colors.outline
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.optionLabel,
                      {
                        color: selectedOption
                          ? theme.colors.onSurface
                          : theme.colors.onSurfaceVariant,
                        fontFamily: selectedOption
                          ? fontFamily.semiBold
                          : fontFamily.regular,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  }

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
  block: { gap: 8 },
  panel: { padding: 6 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  optionLabel: { flex: 1, fontSize: 14, includeFontPadding: false },
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
