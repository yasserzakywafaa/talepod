import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { PaperProvider } from "react-native-paper";

import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { getPaperTheme } from "src/application/paperTheme";

type ThemedPaperProviderProps = {
  children: React.ReactNode;
  /** Owned by `App`, which keeps the splash up until the faces resolve. */
  fontsLoaded: boolean;
};

export const ThemedPaperProvider = ({
  children,
  fontsLoaded,
}: ThemedPaperProviderProps) => {
  const resolvedThemeMode = useResolvedThemeMode();

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
