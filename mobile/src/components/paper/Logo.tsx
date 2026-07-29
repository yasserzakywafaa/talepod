import { Image } from "react-native";

const brandIcon = require("../../../assets/icon.png");

type LogoProps = {
  width?: number;
};

export const Logo = ({ width = 50 }: LogoProps) => (
  <Image
    source={brandIcon}
    style={{ width, height: width }}
    resizeMode="contain"
    accessibilityLabel="logo"
  />
);
