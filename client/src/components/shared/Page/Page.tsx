import "./Page.scss";

import { CSSProperties, useEffect, useRef } from "react";
import { Container, ContainerTypeMap } from "@mui/material";
import axios from "axios";
import LoaderSpinner, {
  LoaderComponentNameEnum,
} from "../Loader/LoaderSpinner";
import { darkBackground, lightTheme } from "src/application/shared/themes";

import APP_CONSTANTS from "src/application/shared/app_constants";
import ApplicationBar from "../ApplicationBar/ApplicationBar";
import Footer from "../Footer/Footer";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ScrollToTopButton from "../BackToTopButton/BackToTopButton";
import SwipeToRefresh from "./features/SwipeToRefresh/SwipeToRefresh";
import classNames from "classnames";
import END_POINTS from "src/application/shared/endpoints";
import routes from "src/application/routes";
import { consumeReturnUrl, saveReturnUrl } from "src/shared/utils/authReturn";
import { useApplicationContext } from "src/application/store/Provider";
import { useLocation, useNavigate } from "react-router-dom";
import { trackGtmEvent } from "src/shared/utils/gtm";

export interface PageProps {
  title: string;
  className?: string;
  isLoading?: boolean;
  noIndex?: boolean;
  style?: CSSProperties;
  swipeToRefresh?: boolean;
  children?: React.ReactNode;
  swipeDownToRefreshThreshold?: number;
  loaderComponentName?: LoaderComponentNameEnum | undefined;
  onRefresh?: () => Promise<void>;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const {
    title,
    style,
    children,
    isLoading,
    noIndex = false,
    className = "",
    containerProps = {},
    swipeToRefresh,
    loaderComponentName,
    swipeDownToRefreshThreshold,
    onRefresh,
  } = params;
  const {
    store: {
      state: { isFetching, themeMode },
      setPreviousUrl,
    },
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const location = useLocation();
  const navigate = useNavigate();
  const oauthReturnHandledRef = useRef(false);

  // While the Google OAuth callback is being processed (the server lands us on
  // "/" with ?authStatus=success before we redirect to the saved return URL),
  // show the full-screen loader so the home page never flashes by. Mirrors the
  // handler's condition below so the spinner always clears once it navigates.
  const oauthParams = new URLSearchParams(location.search);
  const isHandlingOAuthReturn =
    oauthParams.get("authStatus") === "success" &&
    !!oauthParams.get("provider");

  const isPageLoading = isLoading || isFetching || isHandlingOAuthReturn;

  const pageClassNames = classNames({
    container: true,
    [className]: className,
  });

  useEffect(() => {
    // Update page color
    localStorage.setItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME,
      themeMode
    );
    const themeColorMetaTag = document.getElementById("theme-color");
    themeColorMetaTag &&
      themeColorMetaTag.setAttribute(
        "content",
        themeMode === "dark" ? "#14133E" : "#FAF4EA"
      );

    return () => {
      setPreviousUrl(location.pathname);
    };
  }, []);

  // Single source of truth for "where to send the user after auth": remember
  // the last real page they were on (auth/error routes and the OAuth callback
  // are skipped). Survives the Google redirect via sessionStorage.
  useEffect(() => {
    if (new URLSearchParams(location.search).get("authStatus")) return;
    saveReturnUrl(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    let robotsMeta = document.querySelector(
      "meta[name='robots']",
    ) as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      "content",
      noIndex ? "noindex, follow" : "index, follow",
    );
  }, [noIndex]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authStatus = params.get("authStatus");
    const provider = params.get("provider");
    if (authStatus !== "success" || !provider) {
      oauthReturnHandledRef.current = false;
      return;
    }
    if (oauthReturnHandledRef.current) return;
    oauthReturnHandledRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(END_POINTS.AUTH.USER_INFO, {
          withCredentials: true,
        });
        if (cancelled) return;
        handleSetAuthInfo({
          isAuthenticated: true,
          user: data,
        });
        trackGtmEvent("login", { method: provider });
        navigate(consumeReturnUrl() ?? routes.myProfile(data._id), {
          replace: true,
        });
      } catch {
        if (cancelled) return;
        navigate(routes.auth.login, { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate, handleSetAuthInfo]);

  useEffect(() => {
    // Prevent scrolling while page is loading
    const htmlNode = document.getElementsByTagName("html")[0];
    if (isPageLoading) htmlNode.style.overflow = "hidden";
    else htmlNode.removeAttribute("style");
  }, [isPageLoading]);

  return (
    <>
      <div
        className="gradient-background"
        style={{
          background:
            themeMode === "dark"
              ? darkBackground
              : lightTheme.palette.background.default,
        }}
      />
      <Container
        // maxWidth={false}
        style={style}
        className={pageClassNames}
        {...containerProps}
      >
        {swipeToRefresh && (
          <SwipeToRefresh
            threshold={swipeDownToRefreshThreshold}
            onRefresh={onRefresh}
          />
        )}

        <Notification />

        <ApplicationBar />

        <ScrollToTopButton />

        <>{children}</>

        {isPageLoading && (
          <LoaderSpinner loaderComponentName={loaderComponentName} />
        )}

        <Footer />
      </Container>
    </>
  );
};

export default Page;
