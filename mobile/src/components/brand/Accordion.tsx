import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";

type AccordionProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

/**
 * "More story settings (optional)" disclosure — the web renders this as a
 * quiet sunken bar with a chevron, not a Material list row.
 */
export const Accordion = ({
  title,
  expanded,
  onToggle,
  children,
}: AccordionProps) => {
  const theme = useAppTheme();
  const { radius, semantic, fontFamily } = theme.tokens;

  return (
    <View style={styles.block}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        style={({ pressed }) => [
          styles.bar,
          {
            borderRadius: radius.md,
            backgroundColor: semantic.surface2,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
              fontFamily: fontFamily.medium,
            },
          ]}
        >
          {title}
        </Text>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>

      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  block: { gap: 12 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  title: { flex: 1, fontSize: 15, includeFontPadding: false },
  body: { gap: 12 },
});
