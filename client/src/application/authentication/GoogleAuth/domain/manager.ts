import { CredentialResponse } from "@react-oauth/google";
import { GoogleAuthStore } from "./store";

export interface GoogleAuthManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleOnLoginSuccess: (credentialResponse: CredentialResponse) => void;
  handleOnLoginError: () => void;
}

export const useGoogleAuthManager = (
  store: GoogleAuthStore
): GoogleAuthManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.updateState("isFetching", isFetching);
  };

  const handleOnLoginSuccess = (credentialResponse: CredentialResponse) => {
    store.updateState("tokenResponse", credentialResponse);
    console.log("Google Login Response :>>>", {
      credentialResponse,
    });
  };

  const handleOnLoginError = () => {
    console.error("<<<: Google Login failed :>>>");
  };

  return {
    handleIsFetching,
    handleOnLoginSuccess,
    handleOnLoginError,
  };
};
