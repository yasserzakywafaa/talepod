import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppContent from "src/application/AppContent";
import { I18nAppShell } from "src/application/I18nAppShell";
import { ThemedPaperProvider } from "src/application/ThemedPaperProvider";
import { rootNavigationRef } from "src/application/navigation/rootNavigation";
import { paperDarkTheme, paperLightTheme } from "src/application/paperTheme";
import { ApplicationContextProvider } from "src/application/store/Provider";
import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { DashboardOverviewContextProvider } from "src/features/dashboardOverview/store/Provider";
import { DashboardProfileContextProvider } from "src/features/dashboardProfile/store/Provider";
import { StoryFlowProviders } from "src/features/storyCreator/StoryFlowProviders";
import { GenerationProgressSnackbar } from "src/features/storyCreator/generation/GenerationProgressSnackbar";

const NavigationRoot = () => {
  const resolvedThemeMode = useResolvedThemeMode();

  const paperTheme =
    resolvedThemeMode === "light" ? paperLightTheme : paperDarkTheme;

  const navigationTheme =
    resolvedThemeMode === "light"
      ? {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: paperTheme.colors.background,
            card: paperTheme.colors.surface,
            primary: paperTheme.colors.primary,
            text: paperTheme.colors.onSurface,
            border: paperTheme.colors.outline,
          },
        }
      : {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: paperTheme.colors.background,
            card: paperTheme.colors.surface,
            primary: paperTheme.colors.primary,
            text: paperTheme.colors.onSurface,
            border: paperTheme.colors.outline,
          },
        };

  return (
    <NavigationContainer
      ref={rootNavigationRef}
      theme={navigationTheme}
      direction="ltr"
    >
      <AppContent />
      <StatusBar style={resolvedThemeMode === "light" ? "dark" : "light"} />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nAppShell>
          <ApplicationContextProvider>
            <DashboardOverviewContextProvider>
              <DashboardProfileContextProvider>
                <ThemedPaperProvider>
                  <StoryFlowProviders>
                    <NavigationRoot />
                    <GenerationProgressSnackbar />
                  </StoryFlowProviders>
                </ThemedPaperProvider>
              </DashboardProfileContextProvider>
            </DashboardOverviewContextProvider>
          </ApplicationContextProvider>
        </I18nAppShell>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
