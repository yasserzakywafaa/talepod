import { MyProfileState, getMyProfileInitialState } from "./state";

import { UserSubscription } from "src/shared/types/user";
import { useState } from "react";

export interface MyProfileStore {
  state: MyProfileState;
  setIsFetching: (isFetching: boolean) => void;
  setIsDeletingAccount: (isDeletingAccount: boolean) => void;
  setSubscriptionDetails: (subscription: UserSubscription) => void;
}

const useMyProfileStore = (): MyProfileStore => {
  const initialState = getMyProfileInitialState();
  const [state, setState] = useState<MyProfileState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setIsDeletingAccount = (isDeletingAccount: boolean) => {
    setState((prev) => ({
      ...prev,
      isDeletingAccount,
    }));
  };

  const setSubscriptionDetails = (subscription: UserSubscription) => {
    setState((prev) => ({
      ...prev,
      subscription,
    }));
  };

  return {
    state,
    setIsFetching,
    setIsDeletingAccount,
    setSubscriptionDetails,
  };
};

export default useMyProfileStore;
