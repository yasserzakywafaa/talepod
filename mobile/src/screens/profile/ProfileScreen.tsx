import { useTranslation } from "react-i18next";

import { Page } from "src/components/layout/Page";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
import { ProfileScreenContent } from "src/features/dashboardProfile/ProfileScreenContent";

/** Profile tab — opened from the account sheet or bottom-nav highlight state. */
export const ProfileScreen = () => {
  const { t } = useTranslation("common");

  return (
    <Page header={<MainShellAppBar title={t("settings.profile")} />}>
      <ProfileScreenContent />
    </Page>
  );
};
