import { Stripe } from "@stripe/stripe-js";
import { Price, Product } from "src/shared/payment";

export interface PaymentInitialState {
  publishableKey: string;
  clientSecret: string;
  stripePromise: Stripe | null;
  products: Product[];
  prices: Price[];
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    publishableKey: "",
    clientSecret: "",
    stripePromise: null,
    products: [],
    prices: [],
  };
};
