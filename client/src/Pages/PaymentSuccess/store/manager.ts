import END_POINTS from "src/application/shared/endpoints";
import { PaymentSuccessStore } from "./store";
import { User } from "src/shared/user";
import axios from "axios";
import { useMyProfileContext } from "src/Pages/MyProfile/store/Provider";

export interface PaymentSuccessManager {
  handleGetPaymentSuccessData: (sessionId: string) => void;
  handleUpdateUserInfoAfterPayment: () => void;
}

export const usePaymentSuccessManager = (
  store: PaymentSuccessStore
): PaymentSuccessManager => {
  const {
    manager: { handleUpdateUserInfo },
  } = useMyProfileContext();

  const handleGetPaymentSuccessData = async (sessionId: string) => {
    store.handleIsFetching(true);

    try {
      const response = await axios.get(
        END_POINTS.PAYMENTS.GET_CHECKOUT_SESSION_DATA,
        {
          params: {
            sessionId,
          },
        }
      );

      console.log("sessionData:>>>", response.data);

      store.updatePaymentData(response.data);
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

  const handleUpdateUserInfoAfterPayment = async () => {
    // store.handleIsFetching(true);

    try {
      // const paymentSessionData = store.state.paymentSessionData
      const userInfoToUpdate: Partial<User> = {
        isPaidUser: true,
        // subscription: {
        //   id: `${paymentSessionData.subscription}`,
        //   type: subscriptionPlan,
        //   startDate: new Date(),
        //   endDate: getEndDate(),
        //   maxStoriesAllowed: 50,
        //   paymentHistory: [
        //     {
        //       transactionId: `${session.subscription}`,
        //       amount: price.unit_amount / 100,
        //       date: new Date(),
        //     },
        //   ],
        // },
      };

      await handleUpdateUserInfo(userInfoToUpdate);
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
    }
    // finally {
    //   store.handleIsFetching(false);
    // }
  };

  return {
    handleGetPaymentSuccessData,
    handleUpdateUserInfoAfterPayment,
  };
};
