import * as React from "react";

import { Box } from "@mui/material";
import TalePodLogo from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import TalePodLogoSmall from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import { routes } from "src/application/routes";
import { honey300, twilight500 } from "src/application/shared/themes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";

export interface LogoProps {
  variant?: LogoVariant;
  isText?: boolean;
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
  const localizedPath = useLocalizedPath();
  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const {
    variant = "full",
    isText = false,
    component = LogoComponentEnum.IMAGE,
    style,
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (component === LogoComponentEnum.ANCHOR) {
      navigate(localizedPath(routes.features));
    }
  };

  if (isText) {
    return (
      <Box
        sx={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          lineHeight: 1,
        }}
      >
        <span
          style={{
            color: themeMode === "dark" ? "" : twilight500,
          }}
        >
          Tale
        </span>
        <span
          style={{
            color: honey300,
          }}
        >
          Pod
        </span>
      </Box>
    );
  }

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
        alt="TalePod Logo"
        style={defaultStyle}
        width={style?.width}
        height={style?.height}
        onClick={handleClick}
        aria-label="TalePod logo image"
      />
    );
  };

  return renderImageByVariant(variant);
};

export default Logo;
