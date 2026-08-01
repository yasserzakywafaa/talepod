import { useMutation } from "@tanstack/react-query";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { useApplicationContext } from "src/application/store/Provider";
import { getApplicationInitialState } from "src/application/store/state";
import { logApiError } from "src/shared/api/logApiError";
import { clearStoredAuth } from "src/shared/storage/authStorage";

export interface DeleteAccountResult {
  success: boolean;
  errorMessage?: string;
}

/**
 * A pure write with no cached read of its own — the account either goes away
 * or it doesn't, and the outcome is reported back to the caller rather than
 * stored. `useMutation` gives the `isPending` flag the delete dialog needs
 * without a store/manager/Provider quartet built for a single boolean.
 */
export const useDeleteAccount = () => {
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const mutation = useMutation({
    mutationFn: async (confirmationPhrase: string): Promise<void> => {
      await api.delete(END_POINTS.AUTH.DELETE_ACCOUNT, {
        data: { confirmationPhrase },
      });
    },
  });

  const deleteAccount = async (
    confirmationPhrase: string,
  ): Promise<DeleteAccountResult> => {
    try {
      await mutation.mutateAsync(confirmationPhrase);
      await clearStoredAuth();
      await handleSetAuthInfo(getApplicationInitialState().auth);
      return { success: true };
    } catch (error: unknown) {
      logApiError("Failed to delete account", error);
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        errorMessage: err?.response?.data?.message ?? "Failed to delete account",
      };
    }
  };

  return {
    deleteAccount,
    isDeletingAccount: mutation.isPending,
  };
};
