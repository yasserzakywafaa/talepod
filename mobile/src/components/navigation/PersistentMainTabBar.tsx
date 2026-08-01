import { DrawerActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { mobileRoutes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import type { User } from "src/shared/types/user";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import {
  resolveActiveMainTabRoute,
  resolveActiveShellStackRoute,
} from "src/application/navigation/mainShellNavigation";
import {
  openRootSheet,
  rootNavigationRef,
} from "src/application/navigation/rootNavigation";
import {
  FLOATING_TAB_BAR_BOTTOM_GAP,
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_MARGIN_H,
} from "src/components/navigation/floatingTabBarConstants";

type TabRouteName = (typeof mobileRoutes.tabs)[keyof typeof mobileRoutes.tabs];

type TabDef =
  | {
      kind: "route";
      id: string;
      tabRoute: TabRouteName;
      icon: keyof typeof MaterialCommunityIcons.glyphMap;
      labelKey: string;
    }
  | {
      /** A shell-stack screen rather than a bottom tab (e.g. Library). */
      kind: "shell";
      id: string;
      shellRoute: keyof MainShellStackParamList;
      icon: keyof typeof MaterialCommunityIcons.glyphMap;
      labelKey: string;
    }
  | {
      kind: "login";
      id: "login";
      icon: keyof typeof MaterialCommunityIcons.glyphMap;
      labelKey: string;
    }
  | {
      kind: "account";
      id: "account";
      labelKey: "account";
    };

const AUTHENTICATED_TABS: TabDef[] = [
  {
    kind: "route",
    id: mobileRoutes.tabs.create,
    tabRoute: mobileRoutes.tabs.create,
    icon: "auto-fix",
    labelKey: "nav.createProject",
  },
  {
    kind: "route",
    id: mobileRoutes.tabs.myStories,
    tabRoute: mobileRoutes.tabs.myStories,
    /**
     * The web's `WebStoriesOutlined` — a card between two thin rules. Not
     * `view-carousel-outline`, whose fat side blocks are MUI's
     * `ViewCarouselOutlined`, which the web keeps for the Comic format.
     */
    icon: "view-array-outline",
    labelKey: "nav.myStories",
  },
  {
    kind: "route",
    id: mobileRoutes.tabs.myAvatars,
    tabRoute: mobileRoutes.tabs.myAvatars,
    /** The web's `FaceOutlined` — the same glyph, renamed in MCI v6. */
    icon: "face-man-outline",
    labelKey: "story:avatars.page.title",
  },
  {
    kind: "account",
    id: "account",
    labelKey: "account",
  },
];

/**
 * Guests can create and browse, exactly as on the web — My Stories and My
 * Avatars are user-scoped, so they only appear once signed in.
 */
const GUEST_TABS: TabDef[] = [
  {
    kind: "route",
    id: mobileRoutes.tabs.create,
    tabRoute: mobileRoutes.tabs.create,
    icon: "auto-fix",
    labelKey: "nav.createProject",
  },
  {
    kind: "shell",
    id: mobileRoutes.public.library,
    shellRoute: mobileRoutes.public.library,
    icon: "book-open-variant",
    labelKey: "nav.library",
  },
  {
    kind: "login",
    id: "login",
    icon: "login",
    labelKey: "nav.login",
  },
];

const avatarLabel = (user: User): string => {
  const a = user.name.givenName?.charAt(0) ?? "";
  const b = user.name.familyName?.charAt(0) ?? "";
  return (a + b).toUpperCase() || "?";
};

const TabAccountAvatar = ({
  user,
  focused,
}: {
  user: User | null;
  focused: boolean;
}) => {
  const theme = useAppTheme();
  const ringStyle = focused
    ? { borderWidth: 2, borderColor: theme.colors.primary }
    : undefined;

  if (!user) {
    return (
      <MaterialCommunityIcons
        name="account-outline"
        size={22}
        color={theme.colors.onSurfaceVariant}
      />
    );
  }

  if (user.picture) {
    return (
      <Avatar.Image
        size={26}
        source={{ uri: user.picture }}
        style={[styles.accountAvatar, ringStyle]}
      />
    );
  }

  return (
    <Avatar.Text
      size={26}
      label={avatarLabel(user)}
      style={[
        styles.accountAvatar,
        { backgroundColor: theme.colors.surfaceVariant },
        ringStyle,
      ]}
      labelStyle={{ color: theme.colors.onSurface, fontSize: 11 }}
    />
  );
};

type Props = {
  navigation: DrawerNavigationProp<MainDrawerParamList>;
};

const subscribeToRootNavigation = (onStoreChange: () => void) => {
  const listeners: Array<() => void> = [];

  const attachStateListener = () => {
    if (!rootNavigationRef.isReady()) {
      return;
    }

    listeners.push(rootNavigationRef.addListener("state", onStoreChange));
  };

  attachStateListener();

  if (!rootNavigationRef.isReady()) {
    listeners.push(
      rootNavigationRef.addListener("ready", () => {
        onStoreChange();
        attachStateListener();
      }),
    );
  }

  return () => {
    listeners.forEach((unsubscribe) => unsubscribe());
  };
};

const getActiveTabSnapshot = () => {
  if (!rootNavigationRef.isReady()) {
    return null;
  }

  return resolveActiveMainTabRoute(rootNavigationRef.getRootState());
};

const getActiveShellRouteSnapshot = () => {
  if (!rootNavigationRef.isReady()) {
    return null;
  }

  return resolveActiveShellStackRoute(rootNavigationRef.getRootState());
};

export const PersistentMainTabBar = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(["common", "story"]);
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
      },
    },
  } = useApplicationContext();

  const activeTabRoute = useSyncExternalStore(
    subscribeToRootNavigation,
    getActiveTabSnapshot,
    () => null,
  );

  const activeShellRoute = useSyncExternalStore(
    subscribeToRootNavigation,
    getActiveShellRouteSnapshot,
    () => null,
  );

  const tabs = isAuthenticated ? AUTHENTICATED_TABS : GUEST_TABS;

  const goToTab = (tabRoute: TabRouteName) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(mobileRoutes.main.shell, {
      screen: mobileRoutes.main.tabs,
      params: { screen: tabRoute },
    });
  };

  const goToShellScreen = (shellRoute: keyof MainShellStackParamList) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(mobileRoutes.main.shell, { screen: shellRoute });
  };

  const openLoginSheet = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    openRootSheet(mobileRoutes.public.login);
  };

  const openAccountSheet = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    openRootSheet(mobileRoutes.sheet.account);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + FLOATING_TAB_BAR_BOTTOM_GAP,
          // Sideways the notch takes one long edge; inset both so the pill
          // stays centred rather than shifting away from it.
          paddingHorizontal:
            FLOATING_TAB_BAR_MARGIN_H + Math.max(insets.left, insets.right),
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
        {tabs.map((tab) => {
          const isFocused =
            tab.kind === "account"
              ? activeTabRoute === mobileRoutes.tabs.profile
              : tab.kind === "route"
                ? activeTabRoute === tab.tabRoute
                : tab.kind === "shell"
                  ? activeShellRoute === tab.shellRoute
                  : false;

          const label =
            tab.labelKey === "account"
              ? ` ${user?.name.givenName ?? t("account")}`
              : tab.labelKey.startsWith("story:")
                ? t(tab.labelKey)
                : t(tab.labelKey, { ns: "common" });

          const onPress = () => {
            switch (tab.kind) {
              case "account":
                return openAccountSheet();
              case "login":
                return openLoginSheet();
              case "shell":
                return goToShellScreen(tab.shellRoute);
              default:
                return goToTab(tab.tabRoute);
            }
          };

          return (
            <Pressable
              key={tab.id}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              style={[
                styles.tab,
                // Soft honey wash on the active tab — the web's selected pill.
                isFocused && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
            >
              {tab.kind === "account" ? (
                <TabAccountAvatar user={user} focused={isFocused} />
              ) : (
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={22}
                  color={
                    isFocused
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              )}
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
  accountAvatar: {
    borderRadius: 13,
  },
});
