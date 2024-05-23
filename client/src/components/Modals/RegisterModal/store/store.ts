import {
  RegisterModalInitialState,
  getRegisterModalInitialState,
} from "./state";

import { useState } from "react";

export interface RegisterModalStore {
  state: RegisterModalInitialState;
  handleToggleRegisterModal: () => void;
}

const useRegisterModalStore = (): RegisterModalStore => {
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

export default useRegisterModalStore;
