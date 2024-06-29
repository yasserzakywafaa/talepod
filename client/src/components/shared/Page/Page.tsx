import "./Page.scss";

import { Container, ContainerTypeMap } from "@mui/material";
import { darkTheme, lightTheme } from "src/application/shared/themes";

import ApplicationBar from "../ApplicationBar/ApplicationBar";
import LoaderSpinner from "../Loading/LoaderSpinner";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import classNames from "classnames";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";

export interface PageProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const { children, title, className = "", containerProps = {} } = params;
  const {
    store: {
      state: { isFetching, themeMode },
    },
  } = useApplicationContext();

  const pageClassNames = classNames({
    container: true,
    [className]: className,
  });

  useEffect(() => {
    document.title = title;
  }, [title]);

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
        maxWidth={false}
        className={pageClassNames}
        sx={{ overflow: isFetching ? "hidden" : "unset" }}
        {...containerProps}
      >
        {isFetching && <LoaderSpinner />}
        <Notification />
        <ApplicationBar />
        <>{children}</>
      </Container>
    </>
  );
};

export default Page;
