import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigationState } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_MARGIN_H,
} from "src/components/navigation/floatingTabBarConstants";

type TabDef = {
  tabRoute: (typeof mobileRoutes.tabs)[keyof typeof mobileRoutes.tabs];
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  labelKey: string;
};

const TABS: TabDef[] = [
  {
    tabRoute: mobileRoutes.tabs.create,
    icon: "auto-fix",
    labelKey: "nav.createProject",
  },
  {
    tabRoute: mobileRoutes.tabs.myStories,
    icon: "book-open-variant",
    labelKey: "nav.myStories",
  },
  {
    tabRoute: mobileRoutes.tabs.myAvatars,
    icon: "account-circle",
    labelKey: "story:avatars.page.title",
  },
  {
    tabRoute: mobileRoutes.tabs.profile,
    icon: "account-outline",
    labelKey: "settings.profile",
  },
];

type Props = {
  navigation: DrawerNavigationProp<MainDrawerParamList>;
};

export const PersistentMainTabBar = ({ navigation }: Props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(["common", "story"]);

  const activeTabRoute = useNavigationState((state) => {
    if (!state) return null;
    const shellIndex = state.index ?? 0;
    const shellRoute = state.routes[shellIndex];
    if (!shellRoute?.state) return null;
    const stackState = shellRoute.state;
    const stackIndex = stackState.index ?? 0;
    const stackRoute = stackState.routes[stackIndex];
    if (!stackRoute || stackRoute.name !== mobileRoutes.main.tabs || !stackRoute.state) {
      return null;
    }
    const tabState = stackRoute.state;
    const tabIndex = tabState.index ?? 0;
    return tabState.routes[tabIndex]?.name ?? null;
  });

  const goToTab = (tabRoute: TabDef["tabRoute"]) => {
    navigation.navigate(mobileRoutes.main.shell, {
      screen: mobileRoutes.main.tabs,
      params: { screen: tabRoute },
    });
  };

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
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        {TABS.map((tab) => {
          const isFocused = activeTabRoute === tab.tabRoute;
          const label = tab.labelKey.startsWith("story:")
            ? t(tab.labelKey)
            : t(tab.labelKey, { ns: "common" });

          return (
            <Pressable
              key={tab.tabRoute}
              onPress={() => goToTab(tab.tabRoute)}
              style={[
                styles.tab,
                isFocused && { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={
                  isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                variant="labelSmall"
                numberOfLines={1}
                style={{
                  color: isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  marginTop: 2,
                }}
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
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
});
