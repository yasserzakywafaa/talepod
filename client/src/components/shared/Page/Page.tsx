import "./Page.scss";

import { CSSProperties, useEffect, useRef } from "react";
import { Container, ContainerTypeMap, Divider } from "@mui/material";
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
import { useApplicationContext } from "src/application/store/Provider";
import { useLocation, useNavigate } from "react-router-dom";

export interface PageProps {
  title: string;
  className?: string;
  isLoading?: boolean;
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

  const isPageLoading = isLoading || isFetching;

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
        themeMode === "dark" ? "#2E3B4E" : "#F5F5F5"
      );

    return () => {
      setPreviousUrl(location.pathname);
    };
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

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
        navigate(routes.myProfile(data._id), { replace: true });
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

        <Divider sx={{ my: 4 }} />
        <Footer />
      </Container>
    </>
  );
};

export default Page;
