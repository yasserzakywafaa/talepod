import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import { MainTabNavigator } from "src/application/navigation/MainTabNavigator";
import type { MainTabParamList } from "src/application/navigation/MainTabNavigator";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
import { ContactScreen } from "src/screens/marketing/ContactScreen";
import { LibraryScreen } from "src/screens/marketing/LibraryScreen";
import { PricingScreen } from "src/screens/marketing/PricingScreen";

export type MainShellStackParamList = {
  [mobileRoutes.main.tabs]: NavigatorScreenParams<MainTabParamList>;
  [mobileRoutes.public.library]: undefined;
  [mobileRoutes.public.contact]: undefined;
  [mobileRoutes.public.pricing]: undefined;
};

const Stack = createNativeStackNavigator<MainShellStackParamList>();

const ShellStackHeader = ({ titleKey }: { titleKey: string }) => {
  const { t } = useTranslation("common");
  return <MainShellAppBar title={t(titleKey)} />;
};

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
        name={mobileRoutes.public.library}
        component={LibraryScreen}
        options={{
          headerShown: true,
          header: () => <ShellStackHeader titleKey="nav.library" />,
        }}
      />
      <Stack.Screen
        name={mobileRoutes.public.contact}
        component={ContactScreen}
        options={{
          headerShown: true,
          header: () => <ShellStackHeader titleKey="nav.contact" />,
        }}
      />
      <Stack.Screen
        name={mobileRoutes.public.pricing}
        component={PricingScreen}
        options={{
          headerShown: true,
          header: () => <ShellStackHeader titleKey="nav.pricing" />,
        }}
      />
    </Stack.Navigator>
  );
};
