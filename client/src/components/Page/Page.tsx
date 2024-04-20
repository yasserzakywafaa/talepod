import { useEffect } from "react";
import classNames from "classnames";
import { Container, ContainerTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import { Notification } from "../Notification/Notification";
import "./Page.scss";

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
