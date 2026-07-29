import { useEffect } from "react";

import { MainDrawerNavigator } from "src/application/navigation/MainDrawerNavigator";
import { resetToMarketingAfterLogout } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";

/** Redirects unauthenticated users away from the main app shell. */
export const ProtectedMainNavigator = () => {
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (!isAuthenticated) {
      resetToMarketingAfterLogout();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return <MainDrawerNavigator />;
};
