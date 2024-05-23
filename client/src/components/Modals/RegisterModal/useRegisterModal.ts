import { useState } from "react";

export interface RegisterModalInitialState {
  isFetching: boolean;
  isVisible: boolean;
}

export interface RegisterModalStore {
  state: RegisterModalInitialState;
  handleToggleRegisterModal: () => void;
}

export const getRegisterModalInitialState = (): RegisterModalInitialState => {
  return {
    isFetching: false,
    isVisible: false,
  };
};

const useRegisterModal = (): RegisterModalStore => {
  const initialState = getRegisterModalInitialState();
  const [state, setState] = useState<RegisterModalInitialState>(initialState);

  const handleToggleRegisterModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleToggleRegisterModal,
  };
};

export default useRegisterModal;
