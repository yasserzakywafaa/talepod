import { Platform } from "react-native";

/** Visible height of the floating pill tab bar (excluding bottom safe area). */
export const FLOATING_TAB_BAR_HEIGHT = 64;

export const FLOATING_TAB_BAR_MARGIN_H = 16;

export const FLOATING_TAB_BAR_BOTTOM_GAP = 8;

export const getFloatingTabBarTotalInset = (bottomSafeArea: number) =>
  FLOATING_TAB_BAR_HEIGHT +
  FLOATING_TAB_BAR_BOTTOM_GAP +
  bottomSafeArea +
  8;
