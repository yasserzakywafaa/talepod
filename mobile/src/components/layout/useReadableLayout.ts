import { useWindowDimensions } from "react-native";

const TABLET_MIN_WIDTH = 768;

export const useReadableLayout = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const horizontalGutter = isTablet ? 32 : 16;

  return {
    isTablet,
    horizontalGutter,
    /** Max width for page copy blocks (iPad-friendly). */
    contentMaxWidth: isTablet ? Math.min(640, width * 0.72) : width,
    /** Primary actions should not span the full screen on phones. */
    buttonMaxWidth: isTablet ? 360 : Math.min(320, width - horizontalGutter * 2),
  };
};
