import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { mobileRoutes } from "src/application/routes";
import { DashboardOverviewScreen } from "src/screens/dashboard/DashboardOverviewScreen";
import { DashboardStoriesScreen } from "src/screens/dashboard/DashboardStoriesScreen";
import { DashboardUserScreen } from "src/screens/dashboard/DashboardUserScreen";
import { DashboardUsersScreen } from "src/screens/dashboard/DashboardUsersScreen";
import { DashboardUserStoriesScreen } from "src/screens/dashboard/DashboardUserStoriesScreen";

/**
 * The admin sections plus the screens you drill into from them.
 *
 * The drawer wraps this stack rather than owning the sections directly, so a
 * detail screen can be pushed over a list *and* still open the menu — the same
 * arrangement the main shell uses for the story reader.
 */
export type DashboardShellStackParamList = {
  [mobileRoutes.dashboard.overview]: undefined;
  [mobileRoutes.dashboard.users]: undefined;
  [mobileRoutes.dashboard.stories]: undefined;
  [mobileRoutes.dashboard.user]: { userId: string };
  [mobileRoutes.dashboard.userStories]: { userId: string };
};

const Stack = createNativeStackNavigator<DashboardShellStackParamList>();

export const DashboardShellStackNavigator = () => {
  return (
    <Stack.Navigator
      id="DashboardShellStack"
      initialRouteName={mobileRoutes.dashboard.overview}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={mobileRoutes.dashboard.overview}
        component={DashboardOverviewScreen}
      />
      <Stack.Screen
        name={mobileRoutes.dashboard.users}
        component={DashboardUsersScreen}
      />
      <Stack.Screen
        name={mobileRoutes.dashboard.stories}
        component={DashboardStoriesScreen}
      />
      <Stack.Screen
        name={mobileRoutes.dashboard.user}
        component={DashboardUserScreen}
      />
      <Stack.Screen
        name={mobileRoutes.dashboard.userStories}
        component={DashboardUserStoriesScreen}
      />
    </Stack.Navigator>
  );
};
