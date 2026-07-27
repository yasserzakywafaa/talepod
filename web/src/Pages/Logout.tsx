import { useEffect } from "react";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import Page from "src/components/shared/Page/Page";
import axios from "axios";
import { routes } from "src/application/routes";
import { getApplicationInitialState } from "src/application/store/state";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await axios.post(
          END_POINTS.AUTH.LOGOUT,
          {},
          { withCredentials: true },
        );
      } catch {
        // Still clear client session if the server call fails.
      }
      if (cancelled) return;
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "false");
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.USER, "null");
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.TOKEN, "null");
      handleSetAuthInfo(getApplicationInitialState().auth);
      navigate(routes.features, { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [handleSetAuthInfo, navigate]);

  return <Page title="Signing out | TalePod" isLoading />;
};

export default LogoutPage;
