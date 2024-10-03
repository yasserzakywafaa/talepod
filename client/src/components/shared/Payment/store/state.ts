import { Stripe } from "@stripe/stripe-js";

export interface PaymentInitialState {
  publishableKey: string;
  clientSecret: string;
  stripePromise: Stripe | null;
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    publishableKey: "",
    clientSecret: "",
    stripePromise: null,
  };
};
