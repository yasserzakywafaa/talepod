import {
  ContactInitialState,
  ContactSecurityState,
  getContactInitialState,
} from "./state";
import { RefObject, useRef, useState } from "react";

import { TurnstileHandle } from "@yasserzakywafaa/client-core/web/security";

export interface ContactStore {
  state: ContactInitialState;
  resetFormState: () => void;
  handleIsFetching: (isFetching: boolean) => void;
  updateContactForm: (key: string, value: string) => void;
  updateSecurity: (patch: Partial<ContactSecurityState>) => void;
  turnstileRef: RefObject<TurnstileHandle | null>;
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

  const updateSecurity = (patch: Partial<ContactSecurityState>) => {
    setState((prev) => ({ ...prev, security: { ...prev.security, ...patch } }));
  };

  const turnstileRef = useRef<TurnstileHandle | null>(null);

  // Keeps startedAt: the form stays on screen, so the time trap still counts from the first view.
  const resetFormState = () => {
    setState((prev) => ({
      ...initialState,
      security: { ...initialState.security, startedAt: prev.security.startedAt },
    }));
  };

  return {
    state,
    resetFormState,
    handleIsFetching,
    updateContactForm,
    updateSecurity,
    turnstileRef,
  };
};

export default useContactStore;
