import { GoogleAuthStore } from "./store";

export interface GoogleAuthManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleOnGoogleAuthSuccess: () => Promise<undefined>;
  handleOnGoogleAuthError: () => void;
}

export const useGoogleAuthManager = (
  store: GoogleAuthStore,
): GoogleAuthManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.updateState("isFetching", isFetching);
  };

  const handleOnGoogleAuthSuccess = async () => undefined;

  const handleOnGoogleAuthError = () => {
    console.error("Google auth redirect flow: user returned with error");
  };

  return {
    handleIsFetching,
    handleOnGoogleAuthSuccess,
    handleOnGoogleAuthError,
  };
};
