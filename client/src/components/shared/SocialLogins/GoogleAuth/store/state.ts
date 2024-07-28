// import { CredentialResponse } from "@react-oauth/google";

export interface GoogleAuthInitialState {
  isFetching: boolean;
  // tokenResponse: CredentialResponse | undefined;
  tokenResponse: undefined;
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
