import { MaterialCommunityIcons } from "@expo/vector-icons";

type AppleLogoProps = {
  /** Matches the 22px Google glyph so the social buttons line up. */
  size?: number;
  color: string;
};

/**
 * Apple's mark for the Sign in with Apple button.
 *
 * Apple's HIG says to position their logo *file* rather than recreate the mark,
 * and this glyph is a recreation. To close that gap, download the black and
 * white PNGs from Apple Design Resources into `assets/images/`, then swap the
 * body of this component for:
 *
 *   const black = require("../../../assets/images/apple-logo-black.png");
 *   const white = require("../../../assets/images/apple-logo-white.png");
 *   return (
 *     <Image
 *       source={color === "#FFFFFF" ? white : black}
 *       style={{ width: size, height: size }}
 *       resizeMode="contain"
 *     />
 *   );
 *
 * The require has to be swapped rather than guarded — Metro resolves requires
 * statically, so referencing a file that is not there breaks the bundle.
 */
export const AppleLogo = ({ size = 22, color }: AppleLogoProps) => (
  <MaterialCommunityIcons name="apple" size={size} color={color} />
);
