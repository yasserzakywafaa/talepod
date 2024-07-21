import "./Page.scss";

import { Container, ContainerTypeMap } from "@mui/material";
import { darkTheme, lightTheme } from "src/application/shared/themes";

import APP_CONSTANTS from "src/application/shared/app_constants";
import ApplicationBar from "../ApplicationBar/ApplicationBar";
import Footer from "../Footer/Footer";
import LoaderSpinner from "../Loading/LoaderSpinner";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ScrollToTopButton from "../BackToTopButton/BackToTopButton";
import SwipeToRefresh from "./features/SwipeToRefresh/SwipeToRefresh";
import classNames from "classnames";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";

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

  const isPageLoading = isLoading || isFetching;

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
          background:
            themeMode === "dark"
              ? darkTheme.palette.background.default
              : lightTheme.palette.background.default,
        }}
      />
      <Container
        // maxWidth={false}
        className={pageClassNames}
        {...containerProps}
      >
        {isPageLoading && <LoaderSpinner />}

        <SwipeToRefresh
          threshold={swipeDownToRefreshThreshold}
          onRefresh={onRefresh}
        />

        <Notification />

        <ApplicationBar />

        <ScrollToTopButton />

        <>{children}</>

        <Footer />
      </Container>
    </>
  );
};

export default Page;
