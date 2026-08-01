import { useTranslation } from "react-i18next";

import { MainShellAppBar } from "src/components/chrome/MainShellAppBar";

/**
 * Header for library/contact/pricing and the legal pages.
 *
 * These all live in the main shell stack now — signed in or not — so they get
 * the shell app bar, which reaches the drawer through shell context.
 */
export const useDrawerPageHeader = (titleKey: string) => {
  const { t } = useTranslation("common");

  return <MainShellAppBar title={t(titleKey)} />;
};
