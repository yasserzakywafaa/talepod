import { useState } from "react";

export interface CheckoutState {
  activeStep: number;
}

const CheckoutInitialState: CheckoutState = {
  activeStep: 0,
};

export interface UseCheckout {
  state: CheckoutState;
  handleUpdateState: (newState: CheckoutState) => void;
}

export const useCheckout = (): UseCheckout => {
  const [state, setState] = useState<CheckoutState>(CheckoutInitialState);

  const handleUpdateState = (newState: CheckoutState) => {
    setState((prev) => ({
      ...prev,
      newState,
    }));
  };

  return {
    state,
    handleUpdateState,
  };
};
