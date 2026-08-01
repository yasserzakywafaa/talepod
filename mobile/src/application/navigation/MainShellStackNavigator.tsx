import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { MainTabNavigator } from "src/application/navigation/MainTabNavigator";
import type { MainTabParamList } from "src/application/navigation/MainTabNavigator";
import { ContactScreen } from "src/screens/marketing/ContactScreen";
import { LibraryScreen } from "src/screens/marketing/LibraryScreen";
import { PricingScreen } from "src/screens/marketing/PricingScreen";
import { PrivacyPolicyScreen } from "src/screens/marketing/PrivacyPolicyScreen";
import { TermsAndConditionsScreen } from "src/screens/marketing/TermsAndConditionsScreen";
import { ViewStoryScreen } from "src/screens/viewStory/ViewStoryScreen";

export type MainShellStackParamList = {
  [mobileRoutes.main.tabs]: NavigatorScreenParams<MainTabParamList>;
  /**
   * Reading a story lives *inside* the shell, not above it at the root. The
   * drawer belongs to the shell, so a story hosted at the root could never
   * show the menu without first navigating away from itself.
   */
  [mobileRoutes.authenticated.viewStory]: { slug: string };
  [mobileRoutes.public.library]: undefined;
  [mobileRoutes.public.contact]: undefined;
  [mobileRoutes.public.pricing]: undefined;
  [mobileRoutes.public.privacyPolicy]: undefined;
  [mobileRoutes.public.termsAndConditions]: undefined;
};

const Stack = createNativeStackNavigator<MainShellStackParamList>();

export const MainShellStackNavigator = () => {
  return (
    <Stack.Navigator
      id="MainShellStack"
      initialRouteName={mobileRoutes.main.tabs}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={mobileRoutes.main.tabs}
        component={MainTabNavigator}
      />
      <Stack.Screen
        name={mobileRoutes.authenticated.viewStory}
        component={ViewStoryScreen}
      />
      <Stack.Screen
        name={mobileRoutes.public.library}
        component={LibraryScreen}
      />
      <Stack.Screen
        name={mobileRoutes.public.contact}
        component={ContactScreen}
      />
      <Stack.Screen
        name={mobileRoutes.public.pricing}
        component={PricingScreen}
      />
      <Stack.Screen
        name={mobileRoutes.public.privacyPolicy}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name={mobileRoutes.public.termsAndConditions}
        component={TermsAndConditionsScreen}
      />
    </Stack.Navigator>
  );
};
