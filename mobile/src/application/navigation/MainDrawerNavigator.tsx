import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { MainDrawerContent } from "src/components/paper/MainDrawerContent";
import { MarketingAppBar } from "src/components/paper/MarketingAppBar";
import { MainShellScreen } from "src/application/navigation/MainShellScreen";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { useApplicationContext } from "src/application/store/Provider";
import { ContactScreen } from "src/screens/marketing/ContactScreen";
import { HomeMarketingScreen } from "src/screens/marketing/HomeMarketingScreen";
import { LibraryScreen } from "src/screens/marketing/LibraryScreen";
import { PricingScreen } from "src/screens/marketing/PricingScreen";

export type MainDrawerParamList = {
  [mobileRoutes.main.shell]: NavigatorScreenParams<MainShellStackParamList>;
  [mobileRoutes.public.home]: undefined;
  [mobileRoutes.public.pricing]: undefined;
  [mobileRoutes.public.contact]: undefined;
  [mobileRoutes.public.library]: undefined;
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
      screenOptions={({ navigation, route }) => {
        const isShell = route.name === mobileRoutes.main.shell;
        return {
          drawerType: "front",
          drawerPosition: "right",
          drawerStyle: {
            width: drawerWidth,
            backgroundColor: theme.colors.surface,
          },
          drawerActiveBackgroundColor: theme.colors.primary,
          drawerActiveTintColor: theme.colors.onPrimary,
          drawerInactiveTintColor: theme.colors.onSurface,
          headerShown: !isShell,
          header: isShell
            ? undefined
            : () => (
                <MarketingAppBar
                  navigation={navigation}
                  showCreateOnHome={route.name === mobileRoutes.public.home}
                />
              ),
          sceneContainerStyle: { backgroundColor: theme.colors.background },
        };
      }}
    >
      <Drawer.Screen
        name={mobileRoutes.main.shell}
        component={MainShellScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={mobileRoutes.public.home}
        component={HomeMarketingScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.public.pricing}
        component={PricingScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.public.contact}
        component={ContactScreen}
      />
      <Drawer.Screen
        name={mobileRoutes.public.library}
        component={LibraryScreen}
      />
    </Drawer.Navigator>
  );
};

/** @deprecated Use MainDrawerParamList */
export type PublicStackParamList = MainDrawerParamList;
