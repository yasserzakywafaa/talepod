import classNames from "classnames";
import { useEffect } from "react";
import { Notification } from "../Notification/Notification";
import { Container } from "@mui/material";

import "./Page.scss";

const Page = (props) => {
  const { children, title, className = "", containerProps = {} } = props;
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
