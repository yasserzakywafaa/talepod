import { User, UserSubscription } from "src/shared/types/user";

export interface MyProfileState {
  isFetching: boolean;
  isDeletingAccount: boolean;
  user: User | undefined;
  subscription: UserSubscription | undefined;
}

export const getMyProfileInitialState = (): MyProfileState => {
  return {
    isFetching: false,
    isDeletingAccount: false,
    user: undefined,
    subscription: undefined,
  };
};
