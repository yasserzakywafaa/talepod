import { PaymentInitialState, getPaymentInitialState } from "./state";

import { Stripe } from "@stripe/stripe-js";
import { useState } from "react";

export interface PaymentStore {
  state: PaymentInitialState;
  setClientSecret: (clientSecret: string) => void;
  setPublishableKey: (publishableKey: string) => void;
  setStripePromise: (stripePromise: Stripe | null) => void;
}

const usePaymentStore = (): PaymentStore => {
  const initialState = getPaymentInitialState();
  const [state, setState] = useState<PaymentInitialState>(initialState);

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

  const setStripePromise = (stripePromise: Stripe | null) => {
    setState((prev) => ({
      ...prev,
      stripePromise,
    }));
  };

  return {
    state,
    setClientSecret,
    setStripePromise,
    setPublishableKey,
  };
};

export default usePaymentStore;
