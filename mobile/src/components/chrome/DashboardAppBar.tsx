import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Appbar, Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { useDashboardShellDrawer } from "src/application/navigation/DashboardShellDrawerContext";

const routeTitleKeys: Record<string, string> = {
  [mobileRoutes.dashboard.overview]: "nav.overview",
  [mobileRoutes.dashboard.users]: "nav.users",
  [mobileRoutes.dashboard.stories]: "nav.stories",
  [mobileRoutes.dashboard.user]: "admin.user.title",
  [mobileRoutes.dashboard.userStories]: "nav.stories",
};

type DashboardAppBarProps = {
  routeName: string;
  /** Overrides the route's own title — the user pages show a person's name. */
  title?: string;
  /** Detail screens swap the menu for a back arrow, and keep both. */
  showBack?: boolean;
};

/**
 * The drawer comes from shell context rather than a prop: screens inside the
 * admin stack hold a stack navigation prop, which has no `openDrawer`.
 */
export const DashboardAppBar = ({
  routeName,
  title,
  showBack = false,
}: DashboardAppBarProps) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const theme = useTheme();
  const navigation = useNavigation();
  const drawer = useDashboardShellDrawer();

  const titleKey = routeTitleKeys[routeName] ?? "nav.overview";
  const resolvedTitle = title ?? t(titleKey, { ns: "dashboard" });

  const openDrawer = () => drawer?.dispatch(DrawerActions.openDrawer());

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header
      statusBarHeight={0}
      style={[styles.header, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Action
        icon={showBack ? "arrow-left" : "menu"}
        onPress={showBack ? goBack : openDrawer}
        color={theme.colors.onSurface}
        accessibilityLabel={
          showBack ? t("back", { ns: "common" }) : t("settings.menu", { ns: "common" })
        }
      />
      <View style={styles.titleWrap}>
        <Text
          variant="titleMedium"
          style={[styles.breadcrumb, { color: theme.colors.onSurfaceVariant }]}
        >
          {t("settings.dashboard", { ns: "common" })}
        </Text>
        <Text
          variant="titleLarge"
          numberOfLines={1}
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {resolvedTitle}
        </Text>
      </View>
      {showBack ? (
        <Appbar.Action
          icon="menu"
          onPress={openDrawer}
          color={theme.colors.onSurface}
          accessibilityLabel={t("settings.menu", { ns: "common" })}
        />
      ) : null}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 16,
  },
  breadcrumb: {
    fontSize: 12,
  },
  title: {},
});
