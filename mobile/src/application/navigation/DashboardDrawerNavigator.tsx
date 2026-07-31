import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { DRAWER_WIDTH } from "src/application/paperTheme";
import { DashboardDrawerContent } from "src/components/chrome/DashboardDrawerContent";
import { DashboardOverviewScreen } from "src/screens/dashboard/DashboardOverviewScreen";
import { DashboardStoriesScreen } from "src/screens/dashboard/DashboardStoriesScreen";
import { DashboardUsersScreen } from "src/screens/dashboard/DashboardUsersScreen";

export type DashboardDrawerParamList = {
  [mobileRoutes.dashboard.overview]: undefined;
  [mobileRoutes.dashboard.users]: undefined;
  [mobileRoutes.dashboard.stories]: undefined;
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
      initialRouteName={mobileRoutes.dashboard.overview}
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
        name={mobileRoutes.dashboard.overview}
        component={DashboardOverviewScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.dashboard.users}
        component={DashboardUsersScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.dashboard.stories}
        component={DashboardStoriesScreen}
      />
    </Drawer.Navigator>
  );
};

export type DashboardStackParamList = DashboardDrawerParamList;
