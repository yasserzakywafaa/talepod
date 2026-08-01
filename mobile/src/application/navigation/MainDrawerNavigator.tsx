import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { MainDrawerContent } from "src/components/chrome/MainDrawerContent";
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

export const MainDrawerNavigator = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  /**
   * Read per render, not once at import: a width snapshotted in one
   * orientation is wrong in the other — 55% of a landscape screen covers most
   * of the portrait one.
   */
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.55, 320);
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
