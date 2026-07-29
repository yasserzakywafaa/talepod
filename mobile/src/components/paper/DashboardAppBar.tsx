import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Appbar, Text, useTheme } from "react-native-paper";

import { SafeAreaTopBar } from "src/components/layout/SafeAreaTopBar";
import { mobileRoutes } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";

const routeTitleKeys: Record<string, string> = {
  [mobileRoutes.dashboard.overview]: "nav.overview",
  [mobileRoutes.dashboard.adminUsers]: "nav.users",
  [mobileRoutes.dashboard.adminStories]: "nav.stories",
};

type DashboardAppBarProps = {
  navigation: DrawerNavigationProp<DashboardDrawerParamList>;
  routeName: string;
};

export const DashboardAppBar = ({
  navigation,
  routeName,
}: DashboardAppBarProps) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const theme = useTheme();
  const titleKey = routeTitleKeys[routeName] ?? "nav.overview";
  const title = t(titleKey, { ns: "dashboard" });

  return (
    <SafeAreaTopBar>
      <Appbar.Header
        statusBarHeight={0}
        style={[styles.header, { backgroundColor: theme.colors.background }]}
      >
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.openDrawer()}
          color={theme.colors.onSurface}
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
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
        </View>
      </Appbar.Header>
    </SafeAreaTopBar>
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
