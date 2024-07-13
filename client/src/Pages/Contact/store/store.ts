import { ContactInitialState, getContactInitialState } from "./state";

import { useState } from "react";

export interface ContactStore {
  state: ContactInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  updateContactForm: (key: string, value: string) => void;
}

const useContactStore = (): ContactStore => {
  const initialState = getContactInitialState();
  const [state, setState] = useState<ContactInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updateContactForm = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,

        [key]: value,
      },
    }));
  };

  return {
    state,
    handleIsFetching,
    updateContactForm,
  };
};

export default useContactStore;
