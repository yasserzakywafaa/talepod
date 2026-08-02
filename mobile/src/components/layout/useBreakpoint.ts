import { useWindowDimensions } from "react-native";

import {
  BREAKPOINTS,
  BREAKPOINT_ORDER,
  type Breakpoint,
  type ResponsiveValue,
  resolveBreakpoint,
  resolveResponsiveValue,
} from "src/components/layout/breakpoints";

export interface AppBreakpoint {
  width: number;
  height: number;
  /** The largest breakpoint the current width satisfies. */
  breakpoint: Breakpoint;
  isLandscape: boolean;
  /** True at `name` and wider — the direction most layout rules are written in. */
  up: (name: Breakpoint) => boolean;
  /** True strictly below `name`. */
  down: (name: Breakpoint) => boolean;
  /** Resolves a `{ xs, md, … }` map against the current width. */
  value: <T>(map: ResponsiveValue<T>) => T | undefined;
}

/**
 * React Native has no media queries, so width comes from
 * `useWindowDimensions` — which already re-renders on rotation and on iPad
 * Split View, meaning layouts react without a listener of their own.
 */
export const useBreakpoint = (): AppBreakpoint => {
  const { width, height } = useWindowDimensions();
  const breakpoint = resolveBreakpoint(width);
  const index = BREAKPOINT_ORDER.indexOf(breakpoint);

  return {
    width,
    height,
    breakpoint,
    isLandscape: width > height,
    up: (name) => index >= BREAKPOINT_ORDER.indexOf(name),
    down: (name) => index < BREAKPOINT_ORDER.indexOf(name),
    value: (map) => resolveResponsiveValue(map, breakpoint),
  };
};

export { BREAKPOINTS };
export type { Breakpoint, ResponsiveValue };
