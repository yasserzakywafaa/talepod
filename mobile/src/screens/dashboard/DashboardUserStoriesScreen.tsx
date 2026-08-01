import { useEffect } from "react";
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
import {
  DashboardUserContextProvider,
  useDashboardUserContext,
} from "src/features/dashboardUser/store/Provider";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.userStories
>;

const getFullName = (user: User | null): string =>
  user ? `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim() : "";

const UserStoriesContent = ({ userId }: { userId: string }) => {
  const { t } = useTranslation("dashboard");
  const {
    store: {
      state: { paging },
    },
  } = useDashboardStoriesContext();
  const {
    manager: { setUp },
  } = useDashboardUserContext();

  // Fetched only for the heading — the stories come from their own store.
  useEffect(() => {
    void setUp(userId);
  }, [setUp, userId]);

  const totalCount = paging.totalCount ?? 0;

  return (
    <AdminStoriesList
      subtitle={
        totalCount
          ? t("stories.userStoriesTotal", { count: totalCount })
          : t("stories.userStoriesEmpty")
      }
      emptyMessage={t("stories.userStoriesEmpty")}
    />
  );
};

const UserStoriesAppBar = () => {
  const { t } = useTranslation("dashboard");
  const {
    store: {
      state: { user },
    },
  } = useDashboardUserContext();

  const name = getFullName(user);

  return (
    <DashboardAppBar
      routeName={mobileRoutes.dashboard.userStories}
      showBack
      title={name ? t("stories.userStoriesTitle", { name }) : t("stories.title")}
    />
  );
};

export const DashboardUserStoriesScreen = ({ route }: Props) => {
  const { userId } = route.params;

  return (
    <DashboardUserContextProvider>
      <Page header={<UserStoriesAppBar />}>
        <DashboardStoriesContextProvider userId={userId}>
          <UserStoriesContent userId={userId} />
        </DashboardStoriesContextProvider>
      </Page>
    </DashboardUserContextProvider>
  );
};
