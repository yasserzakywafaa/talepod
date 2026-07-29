import { useResolvedThemeMode as useResolvedThemeModeCore } from "@yasserzakywafaa/client-core/native";

import { useApplicationContext } from "src/application/store/Provider";

export const useResolvedThemeMode = () => {
  const {
    store: {
      state: { themePreference },
    },
  } = useApplicationContext();

  return useResolvedThemeModeCore(themePreference);
};
