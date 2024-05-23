import { LoginModalInitialState, getLoginModalInitialState } from "./state";

import { useState } from "react";

export interface LoginModalStore {
  state: LoginModalInitialState;
  handleToggleLoginModal: () => void;
}

const useLoginModalStore = (): LoginModalStore => {
  const initialState = getLoginModalInitialState();
  const [state, setState] = useState<LoginModalInitialState>(initialState);

  const handleToggleLoginModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleToggleLoginModal,
  };
};

export default useLoginModalStore;
