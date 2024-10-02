import axios, { AxiosResponse } from "axios";

import { PaymentStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import { SubscriptionPlanEnum, User } from "src/shared/user";

export interface PaymentManager {
  setUp: () => void;
  handleGetPublishableKey: () => void;
  handleCreatePaymentIntent: () => void;
  handleCreateCheckoutSession: (
    plan: SubscriptionPlanEnum,
    user: User | null
  ) => Promise<void>;
  handleIsFetching: (isFetching: boolean) => void;
}

export const usePaymentManager = (store: PaymentStore): PaymentManager => {
  const setUp = async () => {
    handleGetPublishableKey();
  };

  const handleIsFetching = (isFetching: boolean) => {
    store.setIsFetching(isFetching);
  };

  const handleGetPublishableKey = async (): Promise<any> => {
    store.setIsFetching(true);
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
      store.setIsFetching(false);
    }
  };

  const handleCreatePaymentIntent = async (): Promise<any> => {
    store.setIsFetching(true);
    try {
      const response: AxiosResponse<PaymentIntent, PaymentIntent> =
        await axios.post(
          END_POINTS.PAYMENTS.CREATE_PAYMENT_INTENT,
          {
            product: { id: "talepod-premium", amount: 1 },
          }
          //   {
          //     //   headers: {
          //     //     "Content-Type": "application/json",
          //     //     "X-Custom-Header": new Date().toISOString(),
          //     //   },
          //     // headers: {
          //     //   "Content-Security-Policy": "unsafe-inline",
          //     //   // "script-src 'self' 'unsafe-eval' https://js.stripe.com; frame-src 'self' https://js.stripe.com; connect-src 'self' https://api.stripe.com",
          //     // },
          //   }
        );

      store.setClientSecret(response.data.client_secret || "");

      console.log("ℹ️  createPaymentIntnet:>>>", {
        client_secret: response.data.client_secret,
      });

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get User Information!  ${error}`);
    } finally {
      store.setIsFetching(false);
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
            success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/create`,
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
    handleIsFetching,
    handleGetPublishableKey,
    handleCreatePaymentIntent,
    handleCreateCheckoutSession,
  };
};
