import "./Page.scss";

import { Box, Container, ContainerTypeMap, Typography } from "@mui/material";
import { darkTheme, lightTheme } from "src/application/shared/themes";

import APP_CONSTANTS from "src/application/shared/app_constants";
import ApplicationBar from "../ApplicationBar/ApplicationBar";
import Footer from "../Footer/Footer";
import LoaderSpinner from "../Loading/LoaderSpinner";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ScrollToTopButton from "../BackToTopButton/BackToTopButton";
import classNames from "classnames";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import useSwipeToRefresh from "src/shared/hooks/useSwipeToRefresh";

export interface PageProps {
  title: string;
  className?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  swipeDownToRefreshThreshold?: number;
  onRefresh?: () => Promise<void>;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const {
    title,
    children,
    isLoading,
    className = "",
    containerProps = {},
    swipeDownToRefreshThreshold,
    onRefresh,
  } = params;
  const {
    store: {
      state: { isFetching, themeMode },
    },
  } = useApplicationContext();

  const swipeDownThreshold = swipeDownToRefreshThreshold || 75;
  const { isRefreshing, swipeDistance } = useSwipeToRefresh({
    threshold: swipeDownThreshold,
    onRefresh: onRefresh,
  });

  const isPageLoading = isLoading || isFetching || isRefreshing;

  const pageClassNames = classNames({
    container: true,
    [className]: className,
  });

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Prevent scrolling while page is loading
    const htmlNode = document.getElementsByTagName("html")[0];
    const bodyNode = document.getElementsByTagName("body")[0];
    if (isPageLoading) {
      htmlNode.style.overflow = "hidden";
      bodyNode.style.overflow = "hidden";
    } else {
      htmlNode.removeAttribute("style");
      bodyNode.removeAttribute("style");
    }
  }, [isPageLoading]);

  return (
    <>
      <div
        className="gradient-background"
        style={{
          position: "fixed",
          zIndex: -1,
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat",
          background:
            themeMode === "dark"
              ? darkTheme.palette.background.default
              : lightTheme.palette.background.default,
        }}
      />
      <Container
        // maxWidth={false}
        className={pageClassNames}
        // sx={{ paddingTop: isRefreshing ? "0.5rem" : 0 }}
        {...containerProps}
      >
        <ScrollToTopButton />

        {isPageLoading && <LoaderSpinner />}

        {swipeDistance > 0 && !isRefreshing && (
          <Box
            sx={{
              position: "sticky",
              top: "1rem",
              left: 0,
              right: 0,
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50px",
              maxHeight: "100px",
              height: `${swipeDistance}px`,
              transition: "height 0.2s ease-out",
              marginBottom: "1rem",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            {swipeDistance >= swipeDownThreshold ? (
              <Typography>Release to refresh...</Typography>
            ) : (
              <Typography>Pull to refresh...</Typography>
            )}
          </Box>
        )}

        <Notification />

        <ApplicationBar />

        <>{children}</>

        <Footer />
      </Container>
    </>
  );
};

export default Page;
