import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";

import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import { SafeAreaTopBar } from "src/components/layout/SafeAreaTopBar";

type MainShellAppBarProps = {
  /** @deprecated Prefer `useMainShellDrawer()` from shell layout context. */
  navigation?: DrawerNavigationProp<Record<string, object | undefined>>;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export const MainShellAppBar = ({
  navigation: navigationProp,
  title,
  showBack,
  onBack,
}: MainShellAppBarProps) => {
  const theme = useTheme();
  const drawerFromContext = useMainShellDrawer();
  const drawerNavigation = drawerFromContext ?? navigationProp;

  const openMenu = () => {
    if (!drawerNavigation) return;
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaTopBar>
      <Appbar.Header
        statusBarHeight={0}
        style={[styles.header, { backgroundColor: theme.colors.background }]}
      >
        {showBack && onBack ? (
          <Appbar.BackAction onPress={onBack} color={theme.colors.primary} />
        ) : null}
        {title ? (
          <Appbar.Content
            title={
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {title}
              </Text>
            }
            style={styles.content}
          />
        ) : (
          <View style={styles.flex} />
        )}
        <Appbar.Action
          icon="menu"
          onPress={openMenu}
          color={theme.colors.primary}
        />
      </Appbar.Header>
    </SafeAreaTopBar>
  );
};

const styles = StyleSheet.create({
  header: { elevation: 0 },
  flex: { flex: 1 },
  content: { alignItems: "flex-start" },
});
