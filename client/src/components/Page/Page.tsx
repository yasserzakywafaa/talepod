import "./Page.scss";

import { Container, ContainerTypeMap } from "@mui/material";

import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import classNames from "classnames";
import { useEffect } from "react";

export interface PageProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const { children, title, className = "", containerProps = {} } = params;
  const pageClassNames = classNames({
    container: true,
    [className]: className,
  });

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Container className={pageClassNames} {...containerProps}>
      <Notification />
      <>{children}</>
    </Container>
  );
};

export default Page;
