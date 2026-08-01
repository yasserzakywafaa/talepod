import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import { MainShellDrawerProvider } from "src/application/navigation/MainShellDrawerContext";
import { MainShellStackNavigator } from "src/application/navigation/MainShellStackNavigator";
import { getFloatingTabBarTotalInset } from "src/components/navigation/floatingTabBarConstants";
import { PersistentMainTabBar } from "src/components/navigation/PersistentMainTabBar";

export const MainShellScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const drawerNavigation =
    useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const bottomInset = getFloatingTabBarTotalInset(insets.bottom);

  return (
    <MainShellDrawerProvider navigation={drawerNavigation}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, paddingBottom: bottomInset }}>
          <MainShellStackNavigator />
        </View>
        <PersistentMainTabBar navigation={drawerNavigation} />
      </View>
    </MainShellDrawerProvider>
  );
};
