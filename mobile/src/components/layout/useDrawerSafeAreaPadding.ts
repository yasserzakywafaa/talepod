import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Padding for drawer panels (notch + home indicator). */
export const useDrawerSafeAreaPadding = () => {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top,
    paddingBottom: Math.max(insets.bottom, 12),
  };
};
