import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import { DashboardScreenBody } from "src/components/layout/PageScaffold";

type Props = DrawerScreenProps<
  DashboardDrawerParamList,
  typeof mobileRoutes.dashboard.adminStories
>;

export const AdminStoriesPlaceholderScreen = (_props: Props) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();

  return (
    <DashboardScreenBody>
      <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
        {t("stories.title")}
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        {t("stories.subtitle")}
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        Full admin stories list will ship in a follow-up PR.
      </Text>
    </DashboardScreenBody>
  );
};
