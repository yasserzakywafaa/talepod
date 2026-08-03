import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import { openRootSheet } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { PillButton } from "src/components/brand/PillButton";

/**
 * Trailing-edge "Log in" for the public app bars.
 *
 * Without it the only way back into an existing account from a marketing screen
 * is the drawer, which a returning user has to go looking for. Both app bars
 * also serve signed-in screens, so the auth gate lives here rather than being
 * repeated at each call site.
 */
export const AppBarLoginButton = () => {
  const { t } = useTranslation("common");
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  if (auth.isAuthenticated) return null;

  return (
    <PillButton
      compact
      variant="outlined"
      onPress={() => openRootSheet(mobileRoutes.public.login)}
    >
      {t("nav.login")}
    </PillButton>
  );
};
