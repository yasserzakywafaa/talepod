import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "src/application/theme/useAppTheme";
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_MARGIN_H,
} from "src/components/navigation/floatingTabBarConstants";

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const TAB_ICONS: Record<string, TabIconName> = {
  TabCreate: "auto-fix",
  TabMyStories: "book-open-variant",
  TabMyAvatars: "account-circle",
  TabProfile: "account-outline",
};

export const FloatingMainTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + FLOATING_TAB_BAR_BOTTOM_GAP,
          paddingHorizontal: FLOATING_TAB_BAR_MARGIN_H,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pill,
          theme.tokens.shadow.md,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;

          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? "circle-outline";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tab,
                // Soft honey wash on the active tab — the web's selected pill.
                isFocused && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={
                  isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                    fontFamily: isFocused
                      ? theme.tokens.fontFamily.semiBold
                      : theme.tokens.fontFamily.medium,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    minHeight: FLOATING_TAB_BAR_HEIGHT,
    borderRadius: 32,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 24,
    minHeight: 48,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    includeFontPadding: false,
  },
});
