import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import { CreateTabStackNavigator } from "src/application/navigation/CreateTabStackNavigator";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
import { MainProfileScreen } from "src/screens/main/MainProfileScreen";
import { MyAvatarsScreen } from "src/screens/myAvatars/MyAvatarsScreen";
import { MyStoriesScreen } from "src/screens/myStories/MyStoriesScreen";

export type MainTabParamList = {
  [mobileRoutes.tabs.create]: undefined;
  [mobileRoutes.tabs.myStories]: undefined;
  [mobileRoutes.tabs.myAvatars]: undefined;
  [mobileRoutes.tabs.profile]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const shellHeader = (title?: string) => () => (
  <MainShellAppBar title={title} />
);

export const MainTabNavigator = () => {
  const { t } = useTranslation(["common", "story"]);

  return (
    <Tab.Navigator
      id="MainTabs"
      initialRouteName={mobileRoutes.tabs.myStories}
      screenOptions={{
        headerShown: true,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen
        name={mobileRoutes.tabs.create}
        component={CreateTabStackNavigator}
        options={{
          title: t("nav.createProject"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.myStories}
        component={MyStoriesScreen}
        options={{
          title: t("nav.myStories"),
          header: shellHeader(t("nav.myStories")),
        }}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.myAvatars}
        component={MyAvatarsScreen}
        options={{
          title: t("story:avatars.page.title"),
          header: shellHeader(t("story:avatars.page.title")),
        }}
      />
      <Tab.Screen
        name={mobileRoutes.tabs.profile}
        component={MainProfileScreen}
        options={{
          title: t("settings.profile"),
          header: shellHeader(t("settings.profile")),
        }}
      />
    </Tab.Navigator>
  );
};
