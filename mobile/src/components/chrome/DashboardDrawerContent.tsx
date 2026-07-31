import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Divider, List, useTheme } from "react-native-paper";
import { hasAdminRights } from "src/shared/utils/getUserRoles";

import { useDrawerSafeAreaPadding } from "src/components/layout/useDrawerSafeAreaPadding";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";

import {
  mobileRoutes,
  type DashboardSectionRouteName,
} from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { resolveActiveDashboardStackRoute } from "src/application/navigation/dashboardShellNavigation";
import { navigateToMarketingHome } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { Logo } from "./Logo";
import { SettingsMenuButton } from "./SettingsMenuButton";
import { UserAccountMenuButton } from "./UserAccountMenuButton";

export const DashboardDrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const drawerSafeArea = useDrawerSafeAreaPadding();
  const { navigation, state } = props;
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const user = auth.user;
  const isAdmin = hasAdminRights(user);

  // The drawer holds a single shell route, so the highlighted item comes from
  // the stack nested inside it rather than from the drawer's own index.
  const activeRoute = resolveActiveDashboardStackRoute(state);

  const go = (name: DashboardSectionRouteName) => {
    navigation.navigate(
      mobileRoutes.dashboard.shell,
      { screen: name } as NavigatorScreenParams<DashboardShellStackParamList>,
    );
    navigation.closeDrawer();
  };

  const activeItemStyle = { backgroundColor: theme.colors.primary };
  const activeTitleStyle = { color: theme.colors.onPrimary };
  const inactiveTitleStyle = { color: theme.colors.onSurface };

  const itemTitleFor = (routeName: string) =>
    activeRoute === routeName ? activeTitleStyle : inactiveTitleStyle;

  const itemStyleFor = (routeName: string) =>
    activeRoute === routeName ? activeItemStyle : undefined;

  return (
    <LocaleLayoutBoundary>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.container, drawerSafeArea]}
      >
        <Pressable
          style={styles.logoWrap}
          accessibilityRole="button"
          accessibilityLabel={t("logo")}
          onPress={() => {
            navigation.closeDrawer();
            navigateToMarketingHome();
          }}
        >
          <Logo width={88} />
        </Pressable>

        {isAdmin && (
          <List.Section>
            <List.Item
              title={t("nav.overview")}
              left={(p) => <List.Icon {...p} icon="view-dashboard" />}
              onPress={() => go(mobileRoutes.dashboard.overview)}
              style={itemStyleFor(mobileRoutes.dashboard.overview)}
              titleStyle={itemTitleFor(mobileRoutes.dashboard.overview)}
            />
            <List.Item
              title={t("nav.users")}
              left={(p) => <List.Icon {...p} icon="account-group" />}
              onPress={() => go(mobileRoutes.dashboard.users)}
              style={itemStyleFor(mobileRoutes.dashboard.users)}
              titleStyle={itemTitleFor(mobileRoutes.dashboard.users)}
            />
            <List.Item
              title={t("nav.stories")}
              left={(p) => <List.Icon {...p} icon="book-open-variant" />}
              onPress={() => go(mobileRoutes.dashboard.stories)}
              style={itemStyleFor(mobileRoutes.dashboard.stories)}
              titleStyle={itemTitleFor(mobileRoutes.dashboard.stories)}
            />
          </List.Section>
        )}

        <View style={styles.bottom}>
          <Divider
            style={[styles.divider, { backgroundColor: theme.colors.outline }]}
          />
          {user ? (
            <View style={styles.accountRow}>
              <UserAccountMenuButton user={user} />
              <SettingsMenuButton variant="icon" />
            </View>
          ) : (
            <SettingsMenuButton variant="list" />
          )}
        </View>
      </DrawerContentScrollView>
    </LocaleLayoutBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  logoWrap: {
    padding: 16,
    alignItems: "center",
  },
  divider: {
    marginVertical: 8,
  },
  bottom: {
    marginTop: "auto",
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
