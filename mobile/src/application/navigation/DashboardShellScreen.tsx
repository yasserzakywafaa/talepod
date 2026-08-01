import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import { DashboardShellDrawerProvider } from "src/application/navigation/DashboardShellDrawerContext";
import { DashboardShellStackNavigator } from "src/application/navigation/DashboardShellStackNavigator";

export const DashboardShellScreen = () => {
  const drawerNavigation =
    useNavigation<DrawerNavigationProp<DashboardDrawerParamList>>();

  return (
    <DashboardShellDrawerProvider navigation={drawerNavigation}>
      <DashboardShellStackNavigator />
    </DashboardShellDrawerProvider>
  );
};
