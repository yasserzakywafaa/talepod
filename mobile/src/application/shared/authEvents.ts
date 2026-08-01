/**
 * A one-event emitter connecting the axios layer to React state.
 *
 * When a token refresh fails, the axios interceptor clears storage — but
 * nothing told React, so the UI stayed on an authenticated-looking screen
 * where every subsequent request failed. The user had to force-quit to
 * recover. The application context subscribes here and flips auth state, so
 * an expired session lands the user back on the signed-out UI.
 *
 * It lives outside React because axios is configured once at module load in
 * `index.ts`, long before any provider mounts.
 */
type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();

/** Returns an unsubscribe function, for use in a `useEffect` cleanup. */
export const onSessionExpired = (
  listener: SessionExpiredListener,
): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const emitSessionExpired = (): void => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // One bad subscriber must not stop the others from signing out.
    }
  });
};
