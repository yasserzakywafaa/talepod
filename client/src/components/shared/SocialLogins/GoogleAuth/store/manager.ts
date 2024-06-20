import { CredentialResponse } from "@react-oauth/google";
import { GoogleAuthStore } from "./store";

export interface GoogleAuthManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleOnLoginSuccess: (credentialResponse: CredentialResponse) => void;
  // handleOnLoginSuccess: (response: { id: string; password: string }) => void;
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

  // const handleOnLoginSuccess = (response: { id: string; password: string }) => {
  //   // store.updateState("tokenResponse", credentialResponse);
  //   console.log("Google Login Response :>>>", {
  //     response,
  //   });
  // };

  const handleOnLoginError = () => {
    console.error("<<<: Google Login failed :>>>");
  };

  return {
    handleIsFetching,
    handleOnLoginSuccess,
    handleOnLoginError,
  };
};
