import { useState } from "react";

export interface LoginModalInitialState {
  isFetching: boolean;
  isVisible: boolean;
}

export interface LoginModalStore {
  state: LoginModalInitialState;
  handleToggleLoginModal: () => void;
}

export const getLoginModalInitialState = (): LoginModalInitialState => {
  return {
    isFetching: false,
    isVisible: false,
  };
};

const useLoginModal = (): LoginModalStore => {
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

export default useLoginModal;
