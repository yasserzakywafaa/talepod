/**
 * Connects axios to React state, so a failed token refresh doesn't strand
 * the UI signed-in. Outside React: axios is configured at module load.
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
