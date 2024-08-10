import { CredentialResponse } from "@react-oauth/google";

export interface GoogleAuthInitialState {
  isFetching: boolean;
  authType?: "register" | "login";
  tokenResponse: CredentialResponse | undefined;
}

export interface GoogleAuthAIAnswerProps {
  title: string;
  statusCode: number;
  description: string;
}

export const getGoogleAuthInitialState = (): GoogleAuthInitialState => {
  return {
    isFetching: false,
    authType: undefined,
    tokenResponse: undefined,
  };
};
