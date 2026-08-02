import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { Page } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
import { AdminStoriesList } from "src/features/dashboardStories/AdminStoriesList";
import { useDashboardUser } from "src/features/dashboardUser/useDashboardUser";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.userStories
>;

const getFullName = (user: User | null): string =>
  user ? `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim() : "";

const UserStoriesContent = ({ userId }: { userId: string }) => {
  const { t } = useTranslation("dashboard");

  return (
    <AdminStoriesList
      userId={userId}
      subtitle={(totalCount) =>
        totalCount
          ? t("stories.userStoriesTotal", { count: totalCount })
          : t("stories.userStoriesEmpty")
      }
      emptyMessage={t("stories.userStoriesEmpty")}
    />
  );
};

const UserStoriesAppBar = ({ userId }: { userId: string }) => {
  const { t } = useTranslation("dashboard");
  // Fetched only for the heading — the shared admin cache means this and the
  // list below (which also queries this user's data) never disagree.
  const { user } = useDashboardUser(userId);
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
    <Page header={<UserStoriesAppBar userId={userId} />}>
      <ScreenErrorBoundary name="DashboardUserStories">
        <UserStoriesContent userId={userId} />
      </ScreenErrorBoundary>
    </Page>
  );
};
