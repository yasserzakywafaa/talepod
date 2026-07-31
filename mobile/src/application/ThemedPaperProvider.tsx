import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { PaperProvider } from "react-native-paper";

import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { getPaperTheme } from "src/application/paperTheme";
import { useAppFonts } from "src/application/theme/useAppFonts";

type ThemedPaperProviderProps = {
  children: React.ReactNode;
};

export const ThemedPaperProvider = ({ children }: ThemedPaperProviderProps) => {
  const resolvedThemeMode = useResolvedThemeMode();
  // The brand faces are bundled, so this resolves within a frame or two; the
  // theme falls back to the system face until then rather than blocking paint.
  const fontsLoaded = useAppFonts();

  const theme = useMemo(
    () => getPaperTheme(resolvedThemeMode, fontsLoaded),
    [resolvedThemeMode, fontsLoaded],
  );

  return (
    <PaperProvider
      theme={theme}
      settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
    >
      {children}
    </PaperProvider>
  );
};
