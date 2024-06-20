import "./Page.scss";

import { Container, ContainerTypeMap } from "@mui/material";

import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import classNames from "classnames";
import { useEffect } from "react";
import ApplicationBar from "../ApplicationBar/ApplicationBar";
import { useApplicationContext } from "src/application/store/Provider";
import LoaderSpinner from "../Loading/LoaderSpinner";

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
    <Container maxWidth={false} className={pageClassNames} {...containerProps}>
      {/* {isFetching && <LoaderSpinner style={{ position: "fixed" }} />} */}
      {isFetching && <LoaderSpinner />}
      <Notification />
      <ApplicationBar />
      <>{children}</>
    </Container>
  );
};

export default Page;
