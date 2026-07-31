import { Image } from "react-native";

/**
 * The web's brand mark, copied verbatim from `web/public/icons`. It keeps its
 * alpha channel, so it sits on whatever surface it is placed on — unlike
 * `assets/icon.png`, which is the *app* icon and must be opaque for iOS.
 */
const brandMark = require("../../../assets/logo.png");

type LogoProps = {
  width?: number;
};

export const Logo = ({ width = 64 }: LogoProps) => (
  <Image
    source={brandMark}
    style={{ width, height: width }}
    resizeMode="contain"
    accessibilityLabel="logo"
  />
);
