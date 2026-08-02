import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBreakpoint } from "src/components/layout/useBreakpoint";

export const useReadableLayout = () => {
  const { width, breakpoint, up, value } = useBreakpoint();
  const insets = useSafeAreaInsets();

  // A phone held sideways is wider than 600 and lands here too, which is what
  // we want: copy gets capped and centred rather than stretching.
  const isTablet = up("sm");

  // In landscape only one side reports an inset, so pad both by the larger to
  // clear the notch without knocking content off centre.
  const sideInset = Math.max(insets.left, insets.right);
  const horizontalGutter = (value({ xs: 16, sm: 24, md: 32 }) ?? 16) + sideInset;

  const cap = (max: number) => Math.min(max, width - horizontalGutter * 2);

  return {
    breakpoint,
    isTablet,
    horizontalGutter,
    // Prose stays near 640–760pt however wide the display gets: a line
    // spanning a 12" iPad is harder to read, not a better use of it.
    contentMaxWidth: isTablet
      ? cap(value({ sm: 640, md: 720, lg: 760 }) ?? 640)
      : width,
    // Grids get the room instead — more cards per row is a real gain where a
    // longer line of text is not.
    listMaxWidth: isTablet
      ? cap(value({ sm: 760, md: 1100, lg: 1400 }) ?? 760)
      : width,
    /** Cards per row. Tablets in landscape reach `md`, the largest `lg`. */
    columns: value({ xs: 1, sm: 2, md: 2, lg: 3 }) ?? 1,
    /** Primary actions should not span the full screen on phones. */
    buttonMaxWidth: isTablet ? 360 : Math.min(320, width - horizontalGutter * 2),
  };
};
