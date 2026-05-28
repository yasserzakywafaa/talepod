import { useEffect } from "react";
import { usePaymentContext } from "./store/Provider";

/** Loads Stripe price/product catalog without initializing Stripe.js on the page. */
export const usePaymentCatalog = (): void => {
  const {
    manager: { setUp },
  } = usePaymentContext();

  useEffect(() => {
    setUp();
  }, []);
};
