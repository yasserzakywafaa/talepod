import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { MainDrawerContent } from "src/components/paper/MainDrawerContent";
import { MainShellScreen } from "src/application/navigation/MainShellScreen";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { useApplicationContext } from "src/application/store/Provider";
import { HomeMarketingScreen } from "src/screens/marketing/HomeMarketingScreen";

/**
 * The drawer hosts two things: the app shell and the marketing landing page.
 *
 * Library, contact, pricing and the legal pages are *not* here — they belong
 * to the shell stack, so they keep the tab bar and can push the story reader.
 */
export type MainDrawerParamList = {
  [mobileRoutes.main.shell]: NavigatorScreenParams<MainShellStackParamList>;
  [mobileRoutes.public.home]: undefined;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const drawerWidth = Math.min(Dimensions.get("window").width * 0.55, 320);

export const MainDrawerNavigator = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  const initialRouteName = isAuthenticated
    ? mobileRoutes.main.shell
    : mobileRoutes.public.home;

  return (
    <Drawer.Navigator
      id="MainDrawer"
      key={`${i18n.language}-${isAuthenticated ? "auth" : "guest"}`}
      drawerContent={(props) => <MainDrawerContent {...props} />}
      initialRouteName={initialRouteName}
      screenOptions={{
        drawerType: "front",
        drawerPosition: "right",
        headerShown: false,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: theme.colors.surface,
        },
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerInactiveTintColor: theme.colors.onSurface,
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Drawer.Screen
        name={mobileRoutes.main.shell}
        component={MainShellScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.public.home}
        component={HomeMarketingScreen}
      />
    </Drawer.Navigator>
  );
};

/** @deprecated Use MainDrawerParamList */
export type PublicStackParamList = MainDrawerParamList;
