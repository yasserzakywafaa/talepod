import { Stripe } from "@stripe/stripe-js";

export interface PaymentInitialState {
  isFetching: boolean;
  publishableKey: string;
  clientSecret: string;
  stripePromise: Stripe | null
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    isFetching: false,
    publishableKey: "",
    clientSecret: "",
    stripePromise: null
  };
};
