import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { PaymentSuccessDataResponse } from "./state";
import { PaymentSuccessStore } from "./store";
import { useApplicationContext } from "src/application/store/Provider";

export interface PaymentSuccessManager {
  handleGetPaymentSuccessData: (sessionId: string) => void;
}

export const usePaymentSuccessManager = (
  store: PaymentSuccessStore
): PaymentSuccessManager => {
  const {
    store: {
      state: { auth },
    },
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const handleGetPaymentSuccessData = async (sessionId: string) => {
    store.handleIsFetching(true);

    try {
      const response: AxiosResponse<
        PaymentSuccessDataResponse,
        PaymentSuccessDataResponse
      > = await axios.get(END_POINTS.PAYMENTS.GET_CHECKOUT_SESSION_DATA, {
        params: {
          sessionId,
        },
      });

      store.updatePaymentData({
        ...response.data.session,
        subscription: response.data.subscriptionItem,
        updatedUser: response.data.updatedUser,
      });

      if (auth.user) {
        const fetchedUser = response.data.updatedUser;
        handleSetAuthInfo({ isAuthenticated: true, user: fetchedUser });
        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser)
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Notify({
        //   content: error.response.statusText,
        //   type: ToastTypes.Error,
        // });
      } else {
        // Notify({
        //   content: `Oops! Something went wrong.\n${error}`,
        //   type: ToastTypes.Error,
        // });
      }
      throw new Error(`❌  Failed to get the Session data!  ${error}`);
    } finally {
      store.handleIsFetching(false);
    }
  };

  return {
    handleGetPaymentSuccessData,
  };
};
