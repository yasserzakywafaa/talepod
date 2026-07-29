import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { IconButton, List, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { openRootSheet } from "src/application/navigation/rootNavigation";

type SettingsMenuButtonProps = {
  /** `icon` for dashboard header; `list` for drawer rows (marketing + dashboard). */
  variant?: "icon" | "list";
};

export const SettingsMenuButton = ({
  variant = "icon",
}: SettingsMenuButtonProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();

  const openSheet = () => openRootSheet(mobileRoutes.sheet.settings);

  if (variant === "list") {
    return (
      <List.Item
        title={t("settings.menu")}
        left={(p) => (
          <List.Icon {...p} icon="cog-outline" color={theme.colors.primary} />
        )}
        onPress={openSheet}
        titleStyle={{ color: theme.colors.onSurface }}
      />
    );
  }

  return (
    <IconButton
      icon="cog-outline"
      iconColor={theme.colors.primary}
      size={24}
      onPress={openSheet}
      accessibilityLabel={t("settings.menu")}
      style={styles.icon}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: 0,
  },
});
