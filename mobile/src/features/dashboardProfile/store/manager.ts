import { useCallback, useMemo, useRef } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { useApplicationContext } from "src/application/store/Provider";
import { getApplicationInitialState } from "src/application/store/state";
import { logApiError } from "src/shared/api/logApiError";
import { clearStoredAuth } from "src/shared/storage/authStorage";

import type { DashboardProfileStore } from "./store";

export interface DeleteAccountResult {
  success: boolean;
  errorMessage?: string;
}

export interface DashboardProfileManager {
  handleDeleteAccount: (confirmationPhrase: string) => Promise<DeleteAccountResult>;
}

export const useDashboardProfileManager = (
  store: DashboardProfileStore,
): DashboardProfileManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const handleDeleteAccount = useCallback(
    async (confirmationPhrase: string): Promise<DeleteAccountResult> => {
      try {
        storeRef.current.setIsDeletingAccount(true);

        await api.delete(END_POINTS.AUTH.DELETE_ACCOUNT, {
          data: { confirmationPhrase },
        });

        await clearStoredAuth();
        await handleSetAuthInfo(getApplicationInitialState().auth);

        return { success: true };
      } catch (error: unknown) {
        logApiError("Failed to delete account", error);
        const err = error as { response?: { data?: { message?: string } } };
        const message =
          err?.response?.data?.message ?? "Failed to delete account";
        return { success: false, errorMessage: message };
      } finally {
        storeRef.current.setIsDeletingAccount(false);
      }
    },
    [handleSetAuthInfo],
  );

  return useMemo(() => ({ handleDeleteAccount }), [handleDeleteAccount]);
};
