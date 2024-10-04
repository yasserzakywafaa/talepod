import { Stripe } from "@stripe/stripe-js";
import { Product } from "src/shared/payment";

export interface PaymentInitialState {
  publishableKey: string;
  clientSecret: string;
  stripePromise: Stripe | null;
  products: Product[];
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    publishableKey: "",
    clientSecret: "",
    stripePromise: null,
    products: [],
  };
};
