import { SubscriptionPlanEnum, User } from "src/shared/user";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { PaymentStore } from "./store";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { loadStripe } from "@stripe/stripe-js";
import routes from "src/application/routes";

export interface PaymentManager {
  setUp: () => void;
  handleGetPublishableKey: () => void;
  handleCreateCheckoutSession: (
    plan: SubscriptionPlanEnum,
    user: User | null
  ) => Promise<void>;
}

export const usePaymentManager = (store: PaymentStore): PaymentManager => {
  const setUp = async () => {
    handleGetPublishableKey();
  };

  const handleGetPublishableKey = async (): Promise<any> => {
    // store.setIsFetching(true);
    try {
      const response: AxiosResponse<
        { publishableKey: string },
        { publishableKey: string }
      > = await axios.get(END_POINTS.PAYMENTS.CONFIG, {
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": new Date().toISOString(),
        },
      });

      store.setPublishableKey(response.data.publishableKey);

      const stripePromise = await loadStripe(response.data.publishableKey);
      store.setStripePromise(stripePromise);

      console.log("ℹ️  handleGetPublishableKey:>>>", {
        publishableKey: response.data.publishableKey,
      });

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get Stripe Publishable Key!  ${error}`);
    } finally {
      // store.setIsFetching(false);
    }
  };

  const handleCreateCheckoutSession = async (
    subscriptionPlan: SubscriptionPlanEnum,
    user: User | null
  ): Promise<any> => {
    if (!user) return;

    try {
      // Create a Checkout Session on the server and get the sessionId
      const response: AxiosResponse<{ sessionId: string }> = await axios.post(
        END_POINTS.PAYMENTS.CREATE_CHECKOUT_SESSION,
        {
          metadata: {
            subscriptionPlan,
            userId: user._id,
            // success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            success_url: `${window.location.origin}${routes.paymentSuccess(
              "{CHECKOUT_SESSION_ID}"
            )}`,
            cancel_url: `${window.location.origin}${routes.create}`,
          },
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );
      const { sessionId } = response.data;

      // Redirect to the Stripe Checkout page
      const stripe = store.state.stripePromise;

      if (!stripe) return;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error redirecting to Stripe:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    setUp,
    handleGetPublishableKey,
    handleCreateCheckoutSession,
  };
};
