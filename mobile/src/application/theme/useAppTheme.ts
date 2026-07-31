import { useTheme } from "react-native-paper";

import type { AppTheme } from "src/application/paperTheme";

/**
 * `useTheme()` typed with the TalePod extensions — `theme.tokens` carries the
 * radius / spacing / shadow / gradient scale shared with the web design system.
 */
export const useAppTheme = () => useTheme<AppTheme>();
