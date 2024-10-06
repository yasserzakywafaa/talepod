import { MyProfileState, getMyProfileInitialState } from "./state";

import { useState } from "react";

export interface MyProfileStore {
  state: MyProfileState;
  setIsFetching: (isFetching: boolean) => void;
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

  return {
    state,
    setIsFetching,
  };
};

export default useMyProfileStore;
