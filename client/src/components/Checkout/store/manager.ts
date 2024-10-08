import axios, { AxiosResponse } from "axios";

import { CheckoutStore } from "./store";
import END_POINTS from "../../../application/shared/endpoints";
import { getAxiosError } from "src/shared/utils/getAxiosError";

export interface CheckoutManager {
  setUp: () => void;
  handleGetPublishableKey: () => void;
  handleIsFetching: (isFetching: boolean) => void;
}

export const useCheckoutManager = (store: CheckoutStore): CheckoutManager => {
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

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get Stripe Publishable Key!  ${error}`);
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    handleIsFetching,
    handleGetPublishableKey,
  };
};
