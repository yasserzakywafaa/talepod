import { Appearance, StripeElementsOptions } from "@stripe/stripe-js";

import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { usePaymentContext } from "./store/Provider";

const PaymentWrapper: React.FC = () => {
  const {
    store: {
      state: { stripePromise },
    },
    manager: { setUp },
  } = usePaymentContext();

  useEffect(() => {
    setUp();
  }, []);

  const appearance: Appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#ad932d",
      colorText: "#ffffff",
    },
  };
  const stripeOptions: StripeElementsOptions = {
    appearance,
  };

  return <Elements options={stripeOptions} stripe={stripePromise} />;
};

export default PaymentWrapper;
