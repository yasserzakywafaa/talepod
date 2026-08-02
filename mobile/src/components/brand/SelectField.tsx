import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { SelectFieldShell } from "src/components/brand/SelectFieldShell";

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string | number> = {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  // Painted behind the floating label; pass `colors.surface` in a dialog.
  surfaceColor?: string;
  // Expand in place instead of a Paper `Menu`, which portals behind a
  // React Native `Modal` sheet.
  inline?: boolean;
};

// Outlined select: notched outline, chevron affordance, menu on tap.
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

  const selected = options.find((option) => option.value === value);

  const select = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
  };

  const trigger = (onPress: () => void, chevronUp: boolean) => (
    <SelectFieldShell
      label={label}
      open={open}
      onPress={onPress}
      surfaceColor={surfaceColor}
      accessibilityValueText={selected?.label}
      trailing={
        <MaterialCommunityIcons
          name={chevronUp ? "menu-up" : "menu-down"}
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      }
    >
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
    </SelectFieldShell>
  );

  if (inline) {
    return (
      <View style={styles.block}>
        {trigger(() => setOpen((previous) => !previous), open)}
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
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => select(option.value)}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelected }}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: isSelected
                        ? theme.colors.primaryContainer
                        : "transparent",
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      isSelected
                        ? "check-circle"
                        : "checkbox-blank-circle-outline"
                    }
                    size={18}
                    color={
                      isSelected ? theme.colors.primary : theme.colors.outline
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected
                          ? theme.colors.onSurface
                          : theme.colors.onSurfaceVariant,
                        fontFamily: isSelected
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
      anchor={trigger(() => setOpen(true), false)}
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
          onPress={() => select(option.value)}
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
  value: { flex: 1, fontSize: 16, includeFontPadding: false },
});
