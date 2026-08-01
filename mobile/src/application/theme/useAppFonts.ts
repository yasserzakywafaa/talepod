import { useFonts } from "expo-font";

/**
 * Loads the web V2 brand faces: Yeseva One for display headings, Lexend Deca
 * for everything else. Returns `false` on the first frames; components fall
 * back to the system face until then (see `getPaperTheme`).
 */
export const useAppFonts = () => {
  const [loaded, error] = useFonts({
    "YesevaOne-Regular": require("../../../assets/fonts/YesevaOne-Regular.ttf"),
    "LexendDeca-Light": require("../../../assets/fonts/LexendDeca-Light.ttf"),
    "LexendDeca-Regular": require("../../../assets/fonts/LexendDeca-Regular.ttf"),
    "LexendDeca-Medium": require("../../../assets/fonts/LexendDeca-Medium.ttf"),
    "LexendDeca-SemiBold": require("../../../assets/fonts/LexendDeca-SemiBold.ttf"),
    "LexendDeca-Bold": require("../../../assets/fonts/LexendDeca-Bold.ttf"),
  });

  // A font that fails to decode must not block the UI — fall back silently.
  return loaded || error !== null;
};
