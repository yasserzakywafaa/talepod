import { createContext, useContext, type ReactNode } from "react";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";

const MainShellDrawerContext =
  createContext<DrawerNavigationProp<MainDrawerParamList> | null>(null);

export const MainShellDrawerProvider = ({
  navigation,
  children,
}: {
  navigation: DrawerNavigationProp<MainDrawerParamList>;
  children: ReactNode;
}) => (
  <MainShellDrawerContext.Provider value={navigation}>
    {children}
  </MainShellDrawerContext.Provider>
);

export const useMainShellDrawer = () =>
  useContext(MainShellDrawerContext);
