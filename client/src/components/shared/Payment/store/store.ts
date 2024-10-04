import { PaymentInitialState, getPaymentInitialState } from "./state";

import { Stripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Product } from "src/shared/payment";

export interface PaymentStore {
  state: PaymentInitialState;
  setClientSecret: (clientSecret: string) => void;
  setPublishableKey: (publishableKey: string) => void;
  setStripePromise: (stripePromise: Stripe | null) => void;
  setProducts: (products: Product[]) => void;
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

  const setProducts = (products: Product[]) => {
    setState((prev) => ({
      ...prev,
      products,
    }));
  };

  return {
    state,
    setClientSecret,
    setStripePromise,
    setPublishableKey,
    setProducts,
  };
};

export default usePaymentStore;
