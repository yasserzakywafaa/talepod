import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";
import { DRAWER_WIDTH } from "src/application/paperTheme";
import { MainDrawerContent } from "src/components/paper/MainDrawerContent";
import { MainShellScreen } from "src/application/navigation/MainShellScreen";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";

export type MainDrawerParamList = {
  [mobileRoutes.main.shell]: NavigatorScreenParams<MainShellStackParamList>;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export const MainDrawerNavigator = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Drawer.Navigator
      id="MainDrawer"
      key={i18n.language}
      drawerContent={(props) => <MainDrawerContent {...props} />}
      initialRouteName={mobileRoutes.main.shell}
      screenOptions={{
        drawerType: "front",
        drawerPosition: "right",
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: theme.colors.surface,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name={mobileRoutes.main.shell}
        component={MainShellScreen}
      />
    </Drawer.Navigator>
  );
};
