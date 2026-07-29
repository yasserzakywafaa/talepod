import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { DRAWER_WIDTH } from "src/application/paperTheme";
import { DashboardAppBar } from "src/components/paper/DashboardAppBar";
import { DashboardDrawerContent } from "src/components/paper/DashboardDrawerContent";
import { DashboardOverviewScreen } from "src/screens/dashboard/DashboardOverviewScreen";
import { AdminStoriesPlaceholderScreen } from "src/screens/dashboard/AdminStoriesPlaceholderScreen";
import { AdminUsersPlaceholderScreen } from "src/screens/dashboard/AdminUsersPlaceholderScreen";

export type DashboardDrawerParamList = {
  [mobileRoutes.dashboard.overview]: undefined;
  [mobileRoutes.dashboard.stories]: undefined;
  [mobileRoutes.dashboard.adminUsers]: undefined;
  [mobileRoutes.dashboard.adminStories]: undefined;
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
      screenOptions={({ navigation, route }) => ({
        drawerType: "front",
        drawerPosition: "left",
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: theme.colors.surface,
        },
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerInactiveTintColor: theme.colors.onSurface,
        header: () => (
          <DashboardAppBar navigation={navigation} routeName={route.name} />
        ),
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      })}
    >
      <Drawer.Screen
        name={mobileRoutes.dashboard.overview}
        component={DashboardOverviewScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.dashboard.adminUsers}
        component={AdminUsersPlaceholderScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.dashboard.adminStories}
        component={AdminStoriesPlaceholderScreen}
      />
    </Drawer.Navigator>
  );
};

export type DashboardStackParamList = DashboardDrawerParamList;
