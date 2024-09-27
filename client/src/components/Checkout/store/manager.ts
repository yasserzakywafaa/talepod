import axios, { AxiosResponse } from "axios";

import { CheckoutStore } from "./store";
import END_POINTS from "../../../application/shared/endpoints";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { PaymentIntent } from "@stripe/stripe-js";

export interface CheckoutManager {
  setUp: () => void;
  handleGetPublishableKey: () => void;
  handleCreatePaymentIntent: () => void;
  handleIsFetching: (isFetching: boolean) => void;
}

export const useCheckoutManager = (store: CheckoutStore): CheckoutManager => {
  const setUp = async () => {
    handleGetPublishableKey();
    handleCreatePaymentIntent();
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

  return {
    setUp,
    handleIsFetching,
    handleGetPublishableKey,
    handleCreatePaymentIntent,
  };
};
