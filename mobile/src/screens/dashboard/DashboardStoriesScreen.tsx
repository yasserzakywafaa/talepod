import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { Page } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
import { AdminStoriesList } from "src/features/dashboardStories/AdminStoriesList";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.stories
>;

const DashboardStoriesContent = () => {
  const { t } = useTranslation("dashboard");

  return (
    <AdminStoriesList
      subtitle={(totalCount) =>
        totalCount
          ? t("stories.totalCount", { count: totalCount })
          : t("stories.subtitle")
      }
      emptyMessage={t("stories.empty")}
    />
  );
};

export const DashboardStoriesScreen = ({ route }: Props) => (
  <Page header={<DashboardAppBar routeName={route.name} />}>
    <ScreenErrorBoundary name="DashboardStories">
      <DashboardStoriesContent />
    </ScreenErrorBoundary>
  </Page>
);
