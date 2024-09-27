import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
// import AddressForm from "./AddressForm";
import { useCheckoutContext } from "../store/Provider";
import { useState } from "react";

const StripeGatewayWrapper = () => {
  const {
    store: {
      state: { publishableKey, clientSecret },
    },
  } = useCheckoutContext();

  if (!publishableKey || !clientSecret) return;

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    if (!stripe) return;

    const handleSubmit = async (event: any) => {
      event.preventDefault();

      if (elements == null) {
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        // Show error to your customer
        setErrorMessage(submitError.message);
        return;
      }

      // Create the PaymentIntent and obtain clientSecret from your server endpoint
      const res = await fetch("/create-intent", {
        method: "POST",
      });

      const { client_secret: clientSecret } = await res.json();

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe || !elements}>
          Pay
        </button>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    );
  };

  // ///////////

  // Load your Stripe secret key
  const stripePromise = loadStripe(publishableKey || "");
  const appearance: Appearance = {
    theme: "night",
  };
  const stripeOptions: StripeElementsOptions = {
    appearance,
    clientSecret,
  };

  return (
    <Elements options={stripeOptions} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeGatewayWrapper;
