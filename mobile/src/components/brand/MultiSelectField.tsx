import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";

export type MultiSelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type MultiSelectFieldProps<T extends string | number> = {
  label: string;
  values: T[];
  options: readonly MultiSelectOption<T>[];
  onChange: (values: T[]) => void;
  /** Lays the choices out in a wrapped grid — good for short labels like ages. */
  compactOptions?: boolean;
};

/**
 * Collapsed multi-select — an outlined field showing the current selection,
 * which expands in place to reveal the choices.
 *
 * The web uses a `<Select multiple>` menu here. On a phone a menu that long
 * fights the sheet it lives in, so the options drop down inline instead: the
 * closed state is just as quiet, and nothing has to stack a second modal.
 */
export const MultiSelectField = <T extends string | number>({
  label,
  values,
  options,
  onChange,
  compactOptions = false,
}: MultiSelectFieldProps<T>) => {
  const { t } = useTranslation("library");
  const [open, setOpen] = useState(false);
  const theme = useAppTheme();
  const { radius, fontFamily, brand, semantic } = theme.tokens;

  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);

  const summary = selectedLabels.length
    ? selectedLabels.join(", ")
    : t("filters.languageNone");

  const toggleValue = (value: T) => {
    onChange(
      values.includes(value)
        ? values.filter((entry) => entry !== value)
        : [...values, value],
    );
  };

  return (
    <View style={styles.block}>
      <Pressable
        onPress={() => setOpen((previous) => !previous)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={label}
        accessibilityValue={{ text: summary }}
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
            { backgroundColor: theme.colors.background },
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
            styles.summary,
            {
              color: selectedLabels.length
                ? theme.colors.onSurface
                : theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {summary}
        </Text>

        {selectedLabels.length ? (
          <View
            style={[
              styles.count,
              { backgroundColor: brand.honey[400], borderRadius: radius.pill },
            ]}
          >
            <Text style={[styles.countLabel, { fontFamily: fontFamily.bold }]}>
              {selectedLabels.length}
            </Text>
          </View>
        ) : null}

        <MaterialCommunityIcons
          name={open ? "menu-up" : "menu-down"}
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>

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
            const selected = values.includes(option.value);
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => toggleValue(option.value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                style={({ pressed }) => [
                  compactOptions ? styles.optionCompact : styles.option,
                  {
                    borderRadius: radius.sm,
                    backgroundColor: selected
                      ? theme.colors.primaryContainer
                      : "transparent",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={selected ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={18}
                  color={
                    selected ? theme.colors.primary : theme.colors.outline
                  }
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.optionLabel,
                    {
                      color: selected
                        ? theme.colors.onSurface
                        : theme.colors.onSurfaceVariant,
                      fontFamily: selected
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
};

const styles = StyleSheet.create({
  block: { gap: 8 },
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
  summary: { flex: 1, fontSize: 15, includeFontPadding: false },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  countLabel: { color: "#FFFFFF", fontSize: 11, includeFontPadding: false },
  panel: {
    padding: 6,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  option: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  optionCompact: {
    width: "25%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  optionLabel: { flex: 1, fontSize: 14, includeFontPadding: false },
});
