import axios, { AxiosResponse } from "axios";

import { Authentication } from "src/application/store/state";
import { CredentialResponse } from "@react-oauth/google";
import END_POINTS from "src/application/shared/endpoints";
import { GoogleAuthStore } from "./store";

export interface GoogleAuthManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleOnGoogleAuthSuccess: (
    credentialResponse: CredentialResponse
  ) => Promise<Authentication | undefined>;
  handleOnGoogleAuthError: () => void;
}

export const useGoogleAuthManager = (
  store: GoogleAuthStore
): GoogleAuthManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.updateState("isFetching", isFetching);
  };

  const handleOnGoogleAuthSuccess = async (
    credentialResponse: CredentialResponse
  ): Promise<Authentication | undefined> => {
    if (!credentialResponse.credential) return;

    store.updateState("tokenResponse", credentialResponse);
    try {
      return await authenticateUser(credentialResponse.credential);
    } catch (error: any) {
      throw new Error(
        `❌ Could not authenticate with Google! | ${error.message}`
      );
    }
  };

  const authenticateUser = async (
    credential: string
  ): Promise<Authentication | undefined> => {
    try {
      const response: AxiosResponse<Authentication, any> = await axios.post(
        END_POINTS.AUTH.GOOGLE,
        {
          idToken: credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Failed to authenticate with Google :>>>", {
        error,
      });
    } finally {
      store.handleIsFetching(false);
    }

    return;
    // return {
    //   token: "",
    //   user: null,
    //   isAuthenticated: false,
    // };
  };

  const handleOnGoogleAuthError = () => {
    console.error("<<<: Google AUTH failed :>>>");
  };

  return {
    handleIsFetching,
    handleOnGoogleAuthSuccess,
    handleOnGoogleAuthError,
  };
};
