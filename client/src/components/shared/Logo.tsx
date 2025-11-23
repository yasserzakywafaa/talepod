import * as React from "react";

import TalePodLogo from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import TalePodLogoSmall from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

export interface LogoProps {
  variant?: LogoVariant;
  component?: LogoComponentEnum;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export enum LogoComponentEnum {
  ANCHOR = "anchor",
  IMAGE = "image",
}

export type LogoVariant = "small" | "full";

const Logo = (props: LogoProps) => {
  const navigate = useNavigate();
  const {
    variant = "full",
    component = LogoComponentEnum.IMAGE,
    style,
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (component === LogoComponentEnum.ANCHOR) {
      navigate(routes.features);
    }
  };

  const renderImageByVariant = (variant: LogoVariant) => {
    const logoSrc = variant === "small" ? TalePodLogoSmall : TalePodLogo;
    const defaultStyle: React.CSSProperties = {
      maxWidth: variant === "small" ? "120px" : "200px",
      width: "100%",
      height: "auto",
      objectFit: "contain",
      pointerEvents: "unset",
      margin: 0,
      cursor: component === LogoComponentEnum.ANCHOR ? "pointer" : "default",
      ...style,
    };

    return (
      <img
        src={logoSrc}
        alt="Blogz Logo"
        style={defaultStyle}
        width={style?.width}
        height={style?.height}
        onClick={handleClick}
        aria-label="blogz.ai logo image"
      />
    );
  };

  return renderImageByVariant(variant);
};

export default Logo;
