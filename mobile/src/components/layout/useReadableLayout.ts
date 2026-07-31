import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABLET_MIN_WIDTH = 768;

export const useReadableLayout = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  /**
   * A phone held sideways is wider than 768, so it lands here too — which is
   * what we want: copy gets capped and centred instead of stretching across
   * the long edge.
   */
  const isTablet = width >= TABLET_MIN_WIDTH;

  /**
   * In landscape the notch moves to one side, and only that side reports an
   * inset. Padding both edges by the larger of the two keeps content clear of
   * it without knocking the layout off centre.
   */
  const sideInset = Math.max(insets.left, insets.right);
  const horizontalGutter = (isTablet ? 32 : 16) + sideInset;

  return {
    isTablet,
    horizontalGutter,
    /** Max width for page copy blocks (iPad-friendly). */
    contentMaxWidth: isTablet ? Math.min(640, width * 0.72) : width,
    /** Primary actions should not span the full screen on phones. */
    buttonMaxWidth: isTablet ? 360 : Math.min(320, width - horizontalGutter * 2),
  };
};
