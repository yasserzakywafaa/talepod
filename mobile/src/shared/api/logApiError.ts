import axios from "axios";

const recentLogs = new Map<string, number>();
const THROTTLE_MS = 10_000;

const getErrorKey = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? "network";
    const url = error.config?.url ?? "unknown";
    return `${status}:${url}`;
  }
  return "unknown";
};

/** Avoid spamming Metro when the same request fails repeatedly (e.g. 429). */
export const logApiError = (label: string, error: unknown): void => {
  const key = `${label}:${getErrorKey(error)}`;
  const now = Date.now();
  const last = recentLogs.get(key) ?? 0;
  if (now - last < THROTTLE_MS) {
    return;
  }
  recentLogs.set(key, now);

  if (axios.isAxiosError(error) && error.response?.status === 429) {
    console.warn(
      `${label}: rate limited (429). Wait a moment or restart the API server.`,
    );
    return;
  }

  console.error(label, error);
};
