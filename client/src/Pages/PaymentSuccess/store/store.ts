import {
  PaymentSessionData,
  PaymentSuccessInitialState,
  getPaymentSuccessInitialState,
} from "./state";

import { useState } from "react";

export interface PaymentSuccessStore {
  state: PaymentSuccessInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  updatePaymentData: (paymentData: PaymentSessionData) => void;
}

const usePaymentSuccessStore = (): PaymentSuccessStore => {
  const initialState = getPaymentSuccessInitialState();
  const [state, setState] = useState<PaymentSuccessInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updatePaymentData = (paymentData: PaymentSessionData) => {
    setState((prev) => ({
      ...prev,
      paymentSessionData: paymentData,
    }));
  };

  return {
    state,
    handleIsFetching,
    updatePaymentData,
  };
};

export default usePaymentSuccessStore;
