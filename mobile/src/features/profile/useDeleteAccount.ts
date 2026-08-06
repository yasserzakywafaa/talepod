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
 * A pure write with nothing cached to read back — `useMutation` supplies the
 * one `isPending` flag the delete dialog needs.
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
