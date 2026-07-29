import { useTranslation } from "react-i18next";

import {
  getLayoutDirection,
  type LayoutDirection,
} from "src/shared/utils/layoutDirection";

export const useAppLayoutDirection = (): LayoutDirection => {
  const { i18n } = useTranslation();
  return getLayoutDirection(i18n.language);
};

export const useIsAppRtl = (): boolean =>
  useAppLayoutDirection() === "rtl";
