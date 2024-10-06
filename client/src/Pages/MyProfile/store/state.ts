import { User } from "src/shared/user";

export interface MyProfileState {
  isFetching: boolean;
  user: User | undefined;
}

export const getMyProfileInitialState = (): MyProfileState => {
  return {
    isFetching: false,
    user: undefined,
  };
};
