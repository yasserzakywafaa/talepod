import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { mobileRoutes } from "src/application/routes";
import {
  navigateToMarketingHome,
  openRootSheet,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { getStoredAuth } from "src/shared/storage/authStorage";

import { DashboardDrawerNavigator } from "./DashboardDrawerNavigator";

export const ProtectedDashboardNavigator = () => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const user = auth.user;
  const isAllowed = auth.isAuthenticated && !!user;
  const isAdmin = hasAdminRights(user);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const stored = await getStoredAuth();
        const sessionValid =
          stored.isAuthenticated && !!stored.user && !!stored.accessToken;

        if (!isAllowed && !sessionValid) {
          openRootSheet(mobileRoutes.public.login);
          return;
        }
        if (!isAdmin) {
          navigateToMarketingHome();
        }
      })();
    }, [isAllowed, isAdmin]),
  );

  if (!isAllowed || !isAdmin) {
    return null;
  }

  return <DashboardDrawerNavigator />;
};
