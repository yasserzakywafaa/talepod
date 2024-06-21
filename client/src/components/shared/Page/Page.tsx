import "./Page.scss";

import { Container, ContainerTypeMap } from "@mui/material";

import ApplicationBar from "../ApplicationBar/ApplicationBar";
import LoaderSpinner from "../Loading/LoaderSpinner";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import classNames from "classnames";
import { colorPallets } from "src/application/shared/themes";
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
      state: { isFetching },
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
          // background: `linear-gradient(to top, #000000, #283e51)`,
          background: `linear-gradient(to top, #000000, ${colorPallets.one.background.default})`,
        }}
      />
      <Container
        maxWidth={false}
        className={pageClassNames}
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
