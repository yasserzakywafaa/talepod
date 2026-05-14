export interface GoogleAuthInitialState {
  isFetching: boolean;
  authType?: "register" | "login";
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
  };
};
