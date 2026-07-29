import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { MainDrawerNavigator } from "src/application/navigation/MainDrawerNavigator";
import { ProtectedDashboardNavigator } from "src/application/navigation/ProtectedDashboardNavigator";
import { formSheetScreenOptions } from "src/application/navigation/formSheetScreenOptions";
import type { RootStackParamList } from "src/application/navigation/types";
import { LoginScreen } from "src/screens/LoginScreen";
import { RegisterScreen } from "src/screens/marketing/RegisterScreen";
import { ViewStoryScreen } from "src/screens/viewStory/ViewStoryScreen";
import { MyProfileScreen } from "src/screens/profile/MyProfileScreen";
import { AccountSheetScreen } from "src/screens/sheets/AccountSheetScreen";
import { SettingsSheetScreen } from "src/screens/sheets/SettingsSheetScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const theme = useTheme();
  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
        isFetchingUserInfo,
      },
    },
  } = useApplicationContext();

  const initialRoute = useMemo(() => {
    if (user && hasAdminRights(user)) {
      return rootRoutes.dashboard;
    }
    return rootRoutes.main;
  }, [user]);

  if (isFetchingUserInfo) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name={rootRoutes.main} component={MainDrawerNavigator} />
      <Stack.Screen
        name={rootRoutes.dashboard}
        component={ProtectedDashboardNavigator}
      />
      <Stack.Screen
        name={mobileRoutes.authenticated.viewStory}
        component={ViewStoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={mobileRoutes.authenticated.myProfile}
        component={MyProfileScreen}
        options={{ headerShown: false }}
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
