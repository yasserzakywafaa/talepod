import { useCallback, useState } from "react";

import {
  getDashboardProfileInitialState,
  type DashboardProfileState,
} from "./state";

export interface DashboardProfileStore {
  state: DashboardProfileState;
  setIsDeletingAccount: (isDeletingAccount: boolean) => void;
}

export const useDashboardProfileStore = (): DashboardProfileStore => {
  const [state, setState] = useState<DashboardProfileState>(
    getDashboardProfileInitialState(),
  );

  const setIsDeletingAccount = useCallback((isDeletingAccount: boolean) => {
    setState((prev) => ({ ...prev, isDeletingAccount }));
  }, []);

  return {
    state,
    setIsDeletingAccount,
  };
};
