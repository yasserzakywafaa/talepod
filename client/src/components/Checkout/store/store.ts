import { CheckoutInitialState, getCheckoutInitialState } from "./state";

import { useState } from "react";

export interface CheckoutStore {
  state: CheckoutInitialState;
  setPublishableKey: (publishableKey: string) => void;
  setClientSecret: (clientSecret: string) => void;
  setIsFetching: (handleIsFetching: boolean) => void;
}

const useCheckoutStore = (): CheckoutStore => {
  const initialState = getCheckoutInitialState();
  const [state, setState] = useState<CheckoutInitialState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setPublishableKey = (publishableKey: string) => {
    setState((prev) => ({
      ...prev,
      publishableKey,
    }));
  };

  const setClientSecret = (clientSecret: string) => {
    setState((prev) => ({
      ...prev,
      clientSecret,
    }));
  };

  return {
    state,
    setPublishableKey,
    setClientSecret,
    setIsFetching,
  };
};

export default useCheckoutStore;
