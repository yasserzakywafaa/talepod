import { CredentialResponse } from "@react-oauth/google";

export interface GoogleAuthInitialState {
  isFetching: boolean;
  // tokenResponse: TokenResponse | undefined;
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
    tokenResponse: undefined,
  };
};
