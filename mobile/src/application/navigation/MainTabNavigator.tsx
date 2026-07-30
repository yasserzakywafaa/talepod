import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { mobileRoutes } from "src/application/routes";
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
  return (
    <Tab.Navigator
      id="MainTabs"
      initialRouteName={mobileRoutes.tabs.myStories}
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
