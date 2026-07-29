import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Divider, List, useTheme } from "react-native-paper";

import { useDrawerSafeAreaPadding } from "src/components/layout/useDrawerSafeAreaPadding";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { mobileRoutes } from "src/application/routes";
import type { MarketingDrawerParamList } from "src/application/navigation/MarketingDrawerNavigator";
import {
  navigateToCreateStory,
  openRootSheet,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { Logo } from "./Logo";
import { SettingsMenuButton } from "./SettingsMenuButton";
import { UserAccountMenuButton } from "./UserAccountMenuButton";

const menuItems: Array<{
  labelKey: "nav.features" | "nav.contact" | "nav.library";
  icon: string;
  route: keyof MarketingDrawerParamList;
}> = [
  {
    labelKey: "nav.features",
    icon: "headphones",
    route: mobileRoutes.public.home,
  },
  {
    labelKey: "nav.library",
    icon: "book-open-variant",
    route: mobileRoutes.public.library,
  },
  {
    labelKey: "nav.contact",
    icon: "email-outline",
    route: mobileRoutes.public.contact,
  },
];

export const MarketingDrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const drawerSafeArea = useDrawerSafeAreaPadding();
  const { navigation } = props;
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const user = auth.user;

  const navigate = (route: keyof MarketingDrawerParamList) => {
    navigation.navigate(route);
    navigation.closeDrawer();
  };

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
          onPress={() => navigate(mobileRoutes.public.home)}
        >
          <Logo width={56} />
        </Pressable>

        <List.Section>
          {menuItems.map((item) => (
            <List.Item
              key={item.route}
              title={t(item.labelKey)}
              left={(p) => (
                <List.Icon
                  {...p}
                  icon={item.icon}
                  color={theme.colors.primary}
                />
              )}
              onPress={() => navigate(item.route)}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          ))}

          <Divider
            style={[styles.divider, { backgroundColor: theme.colors.outline }]}
          />

          <List.Item
            title={t("nav.createProject")}
            left={(p) => (
              <List.Icon {...p} icon="auto-fix" color={theme.colors.primary} />
            )}
            onPress={() => {
              if (auth.isAuthenticated) {
                navigation.closeDrawer();
                navigateToCreateStory();
                return;
              }
              navigation.closeDrawer();
              openRootSheet(mobileRoutes.public.login);
            }}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        </List.Section>

        <View style={styles.bottom}>
          <Divider
            style={[
              styles.bottomDivider,
              { backgroundColor: theme.colors.outline },
            ]}
          />
          {user ? (
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
  container: {
    flexGrow: 1,
  },
  logoWrap: {
    padding: 16,
    alignItems: "center",
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 24,
    width: "30%",
  },
  bottomDivider: {
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
