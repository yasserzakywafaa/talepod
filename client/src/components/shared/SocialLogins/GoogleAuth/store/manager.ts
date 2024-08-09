import axios, { AxiosResponse } from "axios";

import { Authentication } from "src/application/store/state";
import { CredentialResponse } from "@react-oauth/google";
import END_POINTS from "src/application/shared/endpoints";
import { GoogleAuthStore } from "./store";

export interface GoogleAuthManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleOnGoogleAuthSuccess: (
    credentialResponse: CredentialResponse
  ) => Promise<Authentication>;
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
  ): Promise<Authentication> => {
    store.updateState("tokenResponse", credentialResponse);

    if (credentialResponse.credential) {
      return await authenticateUser(credentialResponse.credential);
    }

    return {
      token: "",
      user: null,
      isAuthenticated: false,
    };
  };

  const authenticateUser = async (
    credential: string
  ): Promise<Authentication> => {
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

      console.log("authenticateUser:>>>", {
        response,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to authenticate with Google :>>>", {
        error,
      });
    } finally {
      store.handleIsFetching(false);
    }

    return {
      token: "",
      user: null,
      isAuthenticated: false,
    };
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
