import type { User } from "src/shared/types/user";

type PreferencesPatch = NonNullable<Partial<User>["preferences"]>;

let pendingPreferences: PreferencesPatch | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushChain: Promise<void> = Promise.resolve();

const DEBOUNCE_MS = 750;

const mergePreferences = (
  base: PreferencesPatch | null,
  patch: PreferencesPatch,
): PreferencesPatch => ({
  ...(base ?? {}),
  ...patch,
});

export const queueUserPreferencesUpdate = (
  preferencesPatch: PreferencesPatch,
  flush: (merged: PreferencesPatch) => Promise<void>,
): void => {
  pendingPreferences = mergePreferences(pendingPreferences, preferencesPatch);

  if (flushTimer) {
    clearTimeout(flushTimer);
  }

  flushTimer = setTimeout(() => {
    const toFlush = pendingPreferences;
    pendingPreferences = null;
    flushTimer = null;

    if (!toFlush) {
      return;
    }

    flushChain = flushChain
      .then(() => flush(toFlush))
      .catch(() => {
        /* caller logs */
      });
  }, DEBOUNCE_MS);
};

export const flushUserPreferencesNow = async (): Promise<void> => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  await flushChain;
};
