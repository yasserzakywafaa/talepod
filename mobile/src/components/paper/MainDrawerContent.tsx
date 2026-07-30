import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Divider, List, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import {
  buildMainShellTabParams,
  type MainTabRouteName,
} from "src/application/navigation/mainShellNavigation";
import { openRootSheet } from "src/application/navigation/rootNavigation";
import { useDrawerSafeAreaPadding } from "src/components/layout/useDrawerSafeAreaPadding";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { Logo } from "src/components/paper/Logo";
import { SettingsMenuButton } from "src/components/paper/SettingsMenuButton";
import { UserAccountMenuButton } from "src/components/paper/UserAccountMenuButton";
import { useApplicationContext } from "src/application/store/Provider";

export const MainDrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation(["common", "story"]);
  const theme = useTheme();
  const drawerSafeArea = useDrawerSafeAreaPadding();
  const { navigation } = props;
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const user = auth.user;
  const isAuthenticated = auth.isAuthenticated && !!user;

  const navigateDrawer = (route: keyof MainDrawerParamList) => {
    navigation.navigate(route);
    navigation.closeDrawer();
  };

  const goShell = (screen: keyof MainShellStackParamList) => {
    navigation.navigate(mobileRoutes.main.shell, { screen });
    navigation.closeDrawer();
  };

  const goTab = (tabRoute: MainTabRouteName) => {
    const { screen, params } = buildMainShellTabParams(tabRoute);
    navigation.navigate(screen, params);
    navigation.closeDrawer();
  };

  return (
    <LocaleLayoutBoundary>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.container, drawerSafeArea]}
      >
        {isAuthenticated ? (
          <View style={styles.logoWrap} accessibilityLabel={t("logo")}>
            <Logo width={56} />
          </View>
        ) : (
          <Pressable
            style={styles.logoWrap}
            accessibilityRole="button"
            accessibilityLabel={t("logo")}
            onPress={() => navigateDrawer(mobileRoutes.public.home)}
          >
            <Logo width={56} />
          </Pressable>
        )}

        <List.Section>
          {!isAuthenticated ? (
            <List.Item
              title={t("nav.features")}
              left={(p) => <List.Icon {...p} icon="headphones" />}
              onPress={() => navigateDrawer(mobileRoutes.public.home)}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          ) : null}

          <List.Item
            title={t("nav.library")}
            left={(p) => <List.Icon {...p} icon="book-open-variant" />}
            onPress={() =>
              isAuthenticated
                ? goShell(mobileRoutes.public.library)
                : navigateDrawer(mobileRoutes.public.library)
            }
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <List.Item
            title={t("nav.contact")}
            left={(p) => <List.Icon {...p} icon="email-outline" />}
            onPress={() =>
              isAuthenticated
                ? goShell(mobileRoutes.public.contact)
                : navigateDrawer(mobileRoutes.public.contact)
            }
            titleStyle={{ color: theme.colors.onSurface }}
          />
          {isAuthenticated ? (
            <List.Item
              title={t("nav.pricing")}
              left={(p) => <List.Icon {...p} icon="tag-outline" />}
              onPress={() => goShell(mobileRoutes.public.pricing)}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          ) : null}

          {isAuthenticated ? (
            <>
              <Divider
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outline },
                ]}
              />
              <List.Item
                title={t("nav.createProject")}
                left={(p) => (
                  <List.Icon
                    {...p}
                    icon="auto-fix"
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => goTab(mobileRoutes.tabs.create)}
                titleStyle={{ color: theme.colors.onSurface }}
              />
              <List.Item
                title={t("nav.myStories")}
                left={(p) => (
                  <List.Icon
                    {...p}
                    icon="book-open-variant"
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => goTab(mobileRoutes.tabs.myStories)}
                titleStyle={{ color: theme.colors.onSurface }}
              />
              <List.Item
                title={t("avatars.page.title", { ns: "story" })}
                left={(p) => (
                  <List.Icon
                    {...p}
                    icon="account-circle"
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => goTab(mobileRoutes.tabs.myAvatars)}
                titleStyle={{ color: theme.colors.onSurface }}
              />
            </>
          ) : null}

          {!isAuthenticated ? (
            <>
              <Divider
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outline },
                ]}
              />
              <List.Item
                title={t("nav.createProject")}
                left={(p) => (
                  <List.Icon
                    {...p}
                    icon="auto-fix"
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => {
                  navigation.closeDrawer();
                  openRootSheet(mobileRoutes.public.login);
                }}
                titleStyle={{ color: theme.colors.onSurface }}
              />
            </>
          ) : null}
        </List.Section>

        <View style={styles.bottom}>
          <Divider
            style={[
              styles.bottomDivider,
              { backgroundColor: theme.colors.outline },
            ]}
          />
          {isAuthenticated ? (
            <View style={styles.accountRow}>
              <UserAccountMenuButton user={user} />
              <SettingsMenuButton variant="icon" />
            </View>
          ) : (
            <>
              <List.Item
                title={t("nav.register")}
                left={(p) => <List.Icon {...p} icon="account-plus-outline" />}
                onPress={() => {
                  navigation.closeDrawer();
                  openRootSheet(mobileRoutes.public.register);
                }}
                titleStyle={{ color: theme.colors.onSurface }}
              />
              <List.Item
                title={t("nav.login")}
                left={(p) => <List.Icon {...p} icon="login" />}
                onPress={() => {
                  navigation.closeDrawer();
                  openRootSheet(mobileRoutes.public.login);
                }}
                titleStyle={{ color: theme.colors.onSurface }}
              />
              <SettingsMenuButton variant="list" />
            </>
          )}
        </View>
      </DrawerContentScrollView>
    </LocaleLayoutBoundary>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  logoWrap: { padding: 16, alignItems: "center" },
  divider: { marginVertical: 8, marginHorizontal: 24, width: "30%" },
  bottomDivider: { marginVertical: 8 },
  bottom: { marginTop: "auto", paddingBottom: 8, paddingHorizontal: 8 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
