import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { MainDrawerNavigator } from "src/application/navigation/MainDrawerNavigator";
import { ProtectedDashboardNavigator } from "src/application/navigation/ProtectedDashboardNavigator";
import { formSheetScreenOptions } from "src/application/navigation/formSheetScreenOptions";
import type { RootStackParamList } from "src/application/navigation/types";
import { LoginScreen } from "src/screens/auth/LoginScreen";
import { RegisterScreen } from "src/screens/auth/RegisterScreen";
import { AccountSheetScreen } from "src/screens/sheets/AccountSheetScreen";
import { SettingsSheetScreen } from "src/screens/sheets/SettingsSheetScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const theme = useTheme();
  const {
    store: {
      state: { isFetchingUserInfo },
    },
  } = useApplicationContext();

  if (isFetchingUserInfo) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={rootRoutes.main}
    >
      <Stack.Screen name={rootRoutes.main} component={MainDrawerNavigator} />
      <Stack.Screen
        name={rootRoutes.dashboard}
        component={ProtectedDashboardNavigator}
      />
      <Stack.Group screenOptions={formSheetScreenOptions}>
        <Stack.Screen
          name={mobileRoutes.public.login}
          component={LoginScreen}
        />
        <Stack.Screen
          name={mobileRoutes.public.register}
          component={RegisterScreen}
        />
        <Stack.Screen
          name={mobileRoutes.sheet.settings}
          component={SettingsSheetScreen}
        />
        <Stack.Screen
          name={mobileRoutes.sheet.account}
          component={AccountSheetScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppContent;
