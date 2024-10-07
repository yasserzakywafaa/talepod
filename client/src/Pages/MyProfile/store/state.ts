import { User, UserSubscription } from "src/shared/user";

export interface MyProfileState {
  isFetching: boolean;
  user: User | undefined;
  subscription: UserSubscription | undefined;
}

export const getMyProfileInitialState = (): MyProfileState => {
  return {
    isFetching: false,
    user: undefined,
    subscription: undefined,
  };
};
