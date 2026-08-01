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
 * React Query owns server state only; auth/theme/language stay in context.
 * Its online/focus defaults assume a browser, hence NetInfo and AppState.
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
      // Every refetch costs battery and cellular data: 60s means moving
      // between tabs reuses the cache, returning after a minute refreshes.
      staleTime: 60_000,
      gcTime: 5 * 60_000,

      // A 4xx was rejected on its merits, so only transport failures and
      // 5xx are retried — twice, then show the error and a retry button.
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
