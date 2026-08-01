import React, { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";

import { logApiError } from "src/shared/api/logApiError";

/**
 * React Query owns **server** state only — what was fetched, whether it is
 * stale, and whether a request is in flight. Client state (auth, theme,
 * language) stays in the application React context; the two are deliberately
 * separate concerns and should not be merged.
 *
 * React Query is not configured for the web out of the box. Two of its
 * defaults assume a browser and must be wired to React Native equivalents,
 * or queries silently never refetch:
 *
 *  - **Online status** comes from `navigator.onLine`, which does not exist
 *    here. Without NetInfo, a query that fails on a dead connection is
 *    retried on a timer instead of the moment the connection returns.
 *  - **Focus** comes from the browser's `visibilitychange`. The native
 *    equivalent is `AppState` going back to `active`, which is what makes
 *    data refresh when the user returns from the home screen.
 */
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    // `isInternetReachable` is null while NetInfo is still probing; treat
    // that as "connected" so the first fetch after launch is not held back.
    setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
  }),
);

const onAppStateChange = (status: AppStateStatus) => {
  // The web build keeps React Query's own focus handling.
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * A phone is not a desktop browser: every refetch costs battery and
       * possibly cellular data. 60s of staleness is the compromise — moving
       * between tabs reuses the cache, coming back after a minute refreshes.
       */
      staleTime: 60_000,
      gcTime: 5 * 60_000,

      /**
       * Retrying a 4xx just repeats a request the server already rejected on
       * its merits. Only transport failures and 5xx are worth another try,
       * and only twice — a user staring at a spinner would rather see the
       * error and a retry button.
       */
      retry: (failureCount, error) => {
        const status = (
          error as { response?: { status?: number } } | undefined
        )?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),

      refetchOnReconnect: true,
      // Handled by the AppState bridge above rather than the browser default.
      refetchOnWindowFocus: true,
    },
    mutations: {
      // A mutation is a user-initiated write; replaying it automatically can
      // duplicate a story or a charge. Surface the failure instead.
      retry: false,
      onError: (error) => {
        logApiError("Mutation failed", error);
      },
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
