/**
 * MUI's breakpoint scale, in device-independent pixels, so a layout decision
 * reads the same here as it does in `web/`.
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 905,
  lg: 1240,
  xl: 1600,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Ascending, so a lookup can walk down to the nearest defined value. */
export const BREAKPOINT_ORDER: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

/**
 * A value per breakpoint, MUI-style. Sparse on purpose: `{ xs: 1, md: 2 }`
 * means one column until `md`, two from there up.
 */
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>>;

export const resolveBreakpoint = (width: number): Breakpoint => {
  let current: Breakpoint = "xs";
  for (const name of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINTS[name]) current = name;
  }
  return current;
};

/** Picks the value at `breakpoint`, falling back to the nearest one below it. */
export const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint,
): T | undefined => {
  const upTo = BREAKPOINT_ORDER.slice(
    0,
    BREAKPOINT_ORDER.indexOf(breakpoint) + 1,
  );
  for (const name of [...upTo].reverse()) {
    if (value[name] !== undefined) return value[name];
  }
  return undefined;
};
