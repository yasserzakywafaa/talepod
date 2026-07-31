import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { Page } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { AdminStoriesList } from "src/features/dashboardStories/AdminStoriesList";
import {
  DashboardStoriesContextProvider,
  useDashboardStoriesContext,
} from "src/features/dashboardStories/store/Provider";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.stories
>;

const DashboardStoriesContent = () => {
  const { t } = useTranslation("dashboard");
  const {
    store: {
      state: { paging },
    },
  } = useDashboardStoriesContext();

  const totalCount = paging.totalCount ?? 0;

  return (
    <AdminStoriesList
      subtitle={
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
    <DashboardStoriesContextProvider>
      <DashboardStoriesContent />
    </DashboardStoriesContextProvider>
  </Page>
);
