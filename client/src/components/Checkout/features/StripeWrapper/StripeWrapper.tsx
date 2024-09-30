import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";

import { Elements } from "@stripe/react-stripe-js";
import StripeWrapperContent from "./StripeWrapperContent";
import { useCheckoutContext } from "../../store/Provider";

const StripeGatewayWrapper = () => {
  const {
    store: {
      state: { publishableKey, clientSecret },
    },
  } = useCheckoutContext();

  if (!publishableKey || !clientSecret) return;

  const stripePromise = loadStripe(publishableKey || "");
  const appearance: Appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#ad932d",
      colorText: "#ffffff",
    },
  };
  const stripeOptions: StripeElementsOptions = {
    appearance,
    clientSecret,
  };

  return (
    <Elements options={stripeOptions} stripe={stripePromise}>
      <StripeWrapperContent />
    </Elements>
  );
};

export default StripeGatewayWrapper;
