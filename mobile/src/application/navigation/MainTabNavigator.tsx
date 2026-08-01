import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { mobileRoutes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { CreateTabStackNavigator } from "src/application/navigation/CreateTabStackNavigator";
import { ProfileScreen } from "src/screens/profile/ProfileScreen";
import { MyAvatarsScreen } from "src/screens/myAvatars/MyAvatarsScreen";
import { MyStoriesScreen } from "src/screens/myStories/MyStoriesScreen";

export type MainTabParamList = {
  [mobileRoutes.tabs.create]: undefined;
  [mobileRoutes.tabs.myStories]: undefined;
  [mobileRoutes.tabs.myAvatars]: undefined;
  [mobileRoutes.tabs.profile]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  /**
   * The tab under everything else in the shell. My Stories would fetch on
   * mount and sit behind Library as the back target — neither of which makes
   * sense for a guest, whose home in the shell is the story creator.
   */
  const initialRouteName = isAuthenticated
    ? mobileRoutes.tabs.myStories
    : mobileRoutes.tabs.create;

  return (
    <Tab.Navigator
      id="MainTabs"
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen
        name={mobileRoutes.tabs.create}
        component={CreateTabStackNavigator}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.myStories}
        component={MyStoriesScreen}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.myAvatars}
        component={MyAvatarsScreen}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.profile}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};
