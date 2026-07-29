import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { MarketingDrawerContent } from "src/components/paper/MarketingDrawerContent";
import { MarketingAppBar } from "src/components/paper/MarketingAppBar";
import { ContactScreen } from "src/screens/marketing/ContactScreen";
import { HomeMarketingScreen } from "src/screens/marketing/HomeMarketingScreen";
import { LibraryScreen } from "src/screens/marketing/LibraryScreen";
import { PricingScreen } from "src/screens/marketing/PricingScreen";

export type MarketingDrawerParamList = {
  [mobileRoutes.public.home]: undefined;
  [mobileRoutes.public.pricing]: undefined;
  [mobileRoutes.public.contact]: undefined;
  [mobileRoutes.public.library]: undefined;
};

const Drawer = createDrawerNavigator<MarketingDrawerParamList>();

const marketingDrawerWidth = Math.min(
  Dimensions.get("window").width * 0.55,
  320,
);

export const MarketingDrawerNavigator = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Drawer.Navigator
      id="MarketingDrawer"
      key={i18n.language}
      drawerContent={(props) => <MarketingDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        drawerType: "front",
        drawerPosition: "right",
        drawerStyle: {
          width: marketingDrawerWidth,
          backgroundColor: theme.colors.surface,
        },
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerInactiveTintColor: theme.colors.onSurface,
        header: () => (
          <MarketingAppBar
            navigation={navigation}
            showCreateOnHome={route.name === mobileRoutes.public.home}
          />
        ),
        sceneContainerStyle: { backgroundColor: theme.colors.background },
      })}
    >
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

export type PublicStackParamList = MarketingDrawerParamList;
