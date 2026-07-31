import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";

export type UnderlineTab<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

type UnderlineTabsProps<T extends string> = {
  value: T;
  tabs: readonly UnderlineTab<T>[];
  onChange: (value: T) => void;
};

/** MUI-style underline tabs with a honey indicator — the web profile tabs. */
export const UnderlineTabs = <T extends string>({
  value,
  tabs,
  onChange,
}: UnderlineTabsProps<T>) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.bar, { borderBottomColor: theme.colors.outlineVariant }]}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        const color = active
          ? theme.colors.primary
          : theme.colors.onSurfaceVariant;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.tab,
              {
                borderBottomColor: active ? theme.colors.primary : "transparent",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            {tab.icon ? (
              <MaterialCommunityIcons name={tab.icon} size={18} color={color} />
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color,
                  fontFamily: active
                    ? theme.tokens.fontFamily.semiBold
                    : theme.tokens.fontFamily.medium,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    marginBottom: -StyleSheet.hairlineWidth,
  },
  label: { fontSize: 14, includeFontPadding: false },
});
