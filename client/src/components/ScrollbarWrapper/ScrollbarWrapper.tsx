import "./ScrollbarWrapper.scss";

import { CSSProperties } from "react";

interface ScrollbarWrapperProps {
  className?: string;
  style?: CSSProperties;
  children: JSX.Element | JSX.Element[];
}

const ScrollbarWrapper = (props: ScrollbarWrapperProps) => (
  <div
    style={props.style}
    className={`${props.className ?? ""} scrollbar-wrapper`}
  >
    {props.children}
  </div>
);

export default ScrollbarWrapper;
