import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Padding for drawer panels (notch + home indicator, in either orientation). */
export const useDrawerSafeAreaPadding = () => {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top,
    paddingBottom: Math.max(insets.bottom, 12),
    // Held sideways, a drawer on the notch side would otherwise start under it.
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };
};
