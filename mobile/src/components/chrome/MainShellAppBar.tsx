import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";

type MainShellAppBarProps = {
  /** @deprecated Prefer `useMainShellDrawer()` from shell layout context. */
  navigation?: DrawerNavigationProp<Record<string, object | undefined>>;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
};

/**
 * Shell header — the web V2 application bar: a honey "Create Story" pill on
 * the leading edge and a circular, honey-ringed menu button on the trailing
 * edge. When a screen supplies a title, it sits below the bar in the display
 * serif, the way the web renders page headings.
 */
export const MainShellAppBar = ({
  navigation: navigationProp,
  title,
  showBack,
  onBack,
}: MainShellAppBarProps) => {
  const { t } = useTranslation("common");
  const theme = useAppTheme();
  const drawerFromContext = useMainShellDrawer();
  const drawerNavigation = drawerFromContext ?? navigationProp;

  const openMenu = () => {
    if (!drawerNavigation) return;
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.bar}>
        {showBack && onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t("back")}
            style={styles.back}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={theme.colors.primary}
            />
          </Pressable>
        ) : null}

        <PillButton compact onPress={() => navigateToCreateStory()}>
          {t("nav.createProject")}
        </PillButton>

        <View style={styles.spacer} />

        <Pressable
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel={t("settings.menu")}
          hitSlop={8}
          style={({ pressed }) => [
            styles.menu,
            { borderColor: theme.colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <MaterialCommunityIcons
            name="menu"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>

      {title ? (
        <DisplayText size={26} color={theme.colors.primary} style={styles.title}>
          {title}
        </DisplayText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  back: { marginLeft: -8 },
  spacer: { flex: 1 },
  menu: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { paddingHorizontal: 16, paddingBottom: 8 },
});
