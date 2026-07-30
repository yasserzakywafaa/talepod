import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/paper/DashboardAppBar";

type Props = DrawerScreenProps<
  DashboardDrawerParamList,
  typeof mobileRoutes.dashboard.stories
>;

export const DashboardStoriesScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();

  return (
    <Page
      header={
        <DashboardAppBar navigation={navigation} routeName={route.name} />
      }
    >
      <PageBody>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          {t("stories.title")}
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {t("stories.subtitle")}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {t("stories.comingSoon")}
        </Text>
      </PageBody>
    </Page>
  );
};
