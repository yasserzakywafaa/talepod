import { Box, Button } from "@mui/material";
import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { useState } from "react";

const StripeWrapperContent = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnPayClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: "http://localhost:3000/complete",
        return_url: window.location.protocol + "//" + window.location.hostname,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to your `return_url`.
    // For some payment methods like iDEAL, your customer will be redirected to an intermediate site first
    // to authorize the payment,then redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message as string);
    } else {
      setMessage("An unexpected error occurred.");
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {isLoading && <LoaderSpinner />}

      <Box mb={4}>
        <CardElement
          options={{
            disableLink: true,
            iconStyle: "solid",
            hidePostalCode: true,
            preferredNetwork: ["visa"],
          }}
        />
      </Box>

      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />

      <Box mt={4}>
        <Button
          id="submit"
          variant="contained"
          disabled={isLoading || !stripe || !elements}
          onClick={handleOnPayClick}
        >
          {isLoading ? "Loading" : "Pay Now"}
        </Button>
      </Box>

      {message && <div id="payment-message">{message}</div>}
    </div>
  );
};

export default StripeWrapperContent;
