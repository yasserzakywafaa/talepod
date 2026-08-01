import type { NavigationState, PartialState } from "@react-navigation/native";

import { mobileRoutes } from "src/application/routes";

type NavState = NavigationState | PartialState<NavigationState>;

/** Nested params that land on a dashboard section inside the admin shell. */
export const buildDashboardShellParams = (screen: string) => ({
  screen: mobileRoutes.dashboard.shell,
  params: { screen },
});

/**
 * The admin stack's current screen, read from the drawer's own state.
 *
 * The drawer only ever has one route now, so its index says nothing about
 * which section is showing — that lives one level down, in the stack.
 */
export const resolveActiveDashboardStackRoute = (
  state: NavState | undefined,
): string | null => {
  if (!state?.routes?.length) {
    return null;
  }

  const shellRoute = state.routes[state.index ?? 0];
  if (!shellRoute || shellRoute.name !== mobileRoutes.dashboard.shell) {
    return null;
  }

  if (shellRoute.state?.routes?.length) {
    const stackState = shellRoute.state;
    return stackState.routes[stackState.index ?? 0]?.name ?? null;
  }

  // Before the stack mounts, the requested section is only in the params.
  const params = shellRoute.params as { screen?: string } | undefined;
  return params?.screen ?? null;
};
