import { MyProfileInitialState, getMyProfileInitialState } from "./state";

import { useState } from "react";

export interface MyProfileStore {
  state: MyProfileInitialState;
  resetFormState: () => void;
  handleIsFetching: (isFetching: boolean) => void;
  updateMyProfileForm: (key: string, value: string) => void;
}

const useMyProfileStore = (): MyProfileStore => {
  const initialState = getMyProfileInitialState();
  const [state, setState] = useState<MyProfileInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updateMyProfileForm = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      MyProfileForm: {
        ...prev.MyProfileForm,

        [key]: value,
      },
    }));
  };

  const resetFormState = () => {
    setState(initialState);
  };

  return {
    state,
    resetFormState,
    handleIsFetching,
    updateMyProfileForm,
  };
};

export default useMyProfileStore;
