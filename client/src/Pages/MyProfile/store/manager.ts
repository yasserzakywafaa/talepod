import { User, UserSubscription } from "src/shared/types/user";
import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { MyProfileStore } from "./store";
import { Notify } from "src/components/shared/Notification/Notification";
import { useApplicationContext } from "src/application/store/Provider";

export interface MyProfileManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateUserInfo: (userInfoToUpdate: Partial<User>) => Promise<void>;
  handleGetSubscriptionDetails: () => Promise<UserSubscription | undefined>;
  handleCancelSubscription: () => Promise<void>;
}

export const useMyProfileManager = (
  store: MyProfileStore
): MyProfileManager => {
  const {
    store: {
      state: { auth },
    },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const handleIsFetching = (isFetching: boolean): void => {
    store.setIsFetching(isFetching);
  };

  const handleUpdateUserInfo = async (userInfoToUpdate: Partial<User>) => {
    if (!auth.user) return;

    try {
      const { data } = await axios.post<User>(
        END_POINTS.AUTH.UPDATE_USER_INFO,
        {
          userId: auth.user._id,
          userInfoToUpdate,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );

      handleSetAuthInfo({
        isAuthenticated: true,
        user: data,
      });
      handleIsFetching(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleIsFetching(false);
    }
  };

  const handleGetSubscriptionDetails = async (): Promise<
    UserSubscription | undefined
  > => {
    if (!auth.user) return;

    try {
      handleIsFetching(true);
      const response: AxiosResponse<UserSubscription> = await axios.get(
        END_POINTS.PAYMENTS.GET_SUBSCRIPTION_DETAILS,
        {
          params: {
            subscriptionId: auth.user.subscription.id,
          },
          withCredentials: true,
        },
      );

      store.setSubscriptionDetails(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleIsFetching(false);
    }

    return;
  };

  const handleCancelSubscription = async () => {
    try {
      handleIsFetching(true);

      await axios.post(
        END_POINTS.PAYMENTS.CANCEL_SUBSCRIPTION,
        {
          userId: auth.user?._id,
          subscriptionId: auth.user?.subscription.id,
          userStoryCount: auth.user?.stories.length,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (auth.user) {
        const fetchedUser = await handleFetchUserInfo();
        if (fetchedUser) {
          handleSetAuthInfo({
            isAuthenticated: true,
            user: fetchedUser,
          });
          localStorage.setItem(
            APP_CONSTANTS.LOCAL_STORAGE.USER,
            JSON.stringify(fetchedUser),
          );
        }
      }

      Notify({
        type: "success",
        content: "Subscription is canceled &#128148;",
      });

      handleIsFetching(false);
    }
  };

  return {
    handleIsFetching,
    handleUpdateUserInfo,
    handleGetSubscriptionDetails,
    handleCancelSubscription,
  };
};
