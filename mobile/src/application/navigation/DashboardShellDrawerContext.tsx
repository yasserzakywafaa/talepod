import { createContext, useContext, type ReactNode } from "react";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";

const DashboardShellDrawerContext =
  createContext<DrawerNavigationProp<DashboardDrawerParamList> | null>(null);

export const DashboardShellDrawerProvider = ({
  navigation,
  children,
}: {
  navigation: DrawerNavigationProp<DashboardDrawerParamList>;
  children: ReactNode;
}) => (
  <DashboardShellDrawerContext.Provider value={navigation}>
    {children}
  </DashboardShellDrawerContext.Provider>
);

/**
 * The admin drawer, reachable from any screen in the dashboard stack.
 *
 * Screens inside the stack have a stack navigation prop, not a drawer one, so
 * the menu button reads the drawer from here instead of walking parents.
 */
export const useDashboardShellDrawer = () =>
  useContext(DashboardShellDrawerContext);
