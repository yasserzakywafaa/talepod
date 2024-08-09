import APP_CONSTANTS from "../shared/app_constants";
import { ApplicationStore } from "./store";
import { Authentication } from "./state";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleSetAuthInfo: (authInfo: Authentication) => void;
}

export const useApplicationManager = (
  store: ApplicationStore
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  const handleSetAuthInfo = (authInfo: Authentication) => {
    localStorage.setItem(
      APP_CONSTANTS.LOCAL_STORAGE.TOKEN,
      authInfo.token ?? ""
    );
    localStorage.setItem(
      APP_CONSTANTS.LOCAL_STORAGE.USER,
      JSON.stringify(authInfo.user)
    );
    localStorage.setItem(
      APP_CONSTANTS.LOCAL_STORAGE.IS_AUTHENTICATION,
      JSON.stringify(!!authInfo.token)
    );

    store.updateAuthInfo();
  };

  return {
    handleIsFetching,
    handleSetAuthInfo,
  };
};
