import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { PaperProvider } from "react-native-paper";

import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { paperDarkTheme, paperLightTheme } from "src/application/paperTheme";

type ThemedPaperProviderProps = {
  children: React.ReactNode;
};

export const ThemedPaperProvider = ({ children }: ThemedPaperProviderProps) => {
  const resolvedThemeMode = useResolvedThemeMode();

  const theme = useMemo(
    () => (resolvedThemeMode === "light" ? paperLightTheme : paperDarkTheme),
    [resolvedThemeMode],
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
