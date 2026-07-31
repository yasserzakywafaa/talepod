import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { DRAWER_WIDTH } from "src/application/paperTheme";
import { DashboardDrawerContent } from "src/components/chrome/DashboardDrawerContent";
import { DashboardShellScreen } from "src/application/navigation/DashboardShellScreen";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";

/**
 * The admin drawer hosts one screen: the stack holding every admin section.
 *
 * The sections used to be drawer screens directly, which left nowhere to push
 * a user or story detail page — and anything pushed above the drawer could not
 * have opened the menu.
 */
export type DashboardDrawerParamList = {
  [mobileRoutes.dashboard.shell]: NavigatorScreenParams<DashboardShellStackParamList>;
};

const Drawer = createDrawerNavigator<DashboardDrawerParamList>();

export const DashboardDrawerNavigator = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Drawer.Navigator
      id="DashboardDrawer"
      key={i18n.language}
      drawerContent={(props) => <DashboardDrawerContent {...props} />}
      initialRouteName={mobileRoutes.dashboard.shell}
      screenOptions={{
        drawerType: "front",
        drawerPosition: "left",
        headerShown: false,
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: theme.colors.surface,
        },
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerInactiveTintColor: theme.colors.onSurface,
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Drawer.Screen
        name={mobileRoutes.dashboard.shell}
        component={DashboardShellScreen}
      />
    </Drawer.Navigator>
  );
};
