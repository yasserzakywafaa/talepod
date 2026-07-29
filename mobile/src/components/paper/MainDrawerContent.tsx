import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Divider, List, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { useDrawerSafeAreaPadding } from "src/components/layout/useDrawerSafeAreaPadding";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { Logo } from "src/components/paper/Logo";
import { SettingsMenuButton } from "src/components/paper/SettingsMenuButton";
import { UserAccountMenuButton } from "src/components/paper/UserAccountMenuButton";
import { useApplicationContext } from "src/application/store/Provider";

import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";

export const MainDrawerContent = (props: DrawerContentComponentProps) => {
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

  const goShell = (screen: keyof MainShellStackParamList) => {
    navigation.navigate(mobileRoutes.main.shell, { screen });
    navigation.closeDrawer();
  };

  return (
    <LocaleLayoutBoundary>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.container, drawerSafeArea]}
      >
        <View style={styles.logoWrap} accessibilityLabel={t("logo")}>
          <Logo width={56} />
        </View>

        <List.Section>
          <List.Item
            title={t("nav.library")}
            left={(p) => <List.Icon {...p} icon="book-open-variant" />}
            onPress={() => goShell(mobileRoutes.public.library)}
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <List.Item
            title={t("nav.contact")}
            left={(p) => <List.Icon {...p} icon="email-outline" />}
            onPress={() => goShell(mobileRoutes.public.contact)}
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <List.Item
            title={t("nav.pricing")}
            left={(p) => <List.Icon {...p} icon="tag-outline" />}
            onPress={() => goShell(mobileRoutes.public.pricing)}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        </List.Section>

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
  container: { flexGrow: 1 },
  logoWrap: { padding: 16, alignItems: "center" },
  divider: { marginVertical: 8 },
  bottom: { marginTop: "auto", paddingBottom: 8, paddingHorizontal: 8 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
