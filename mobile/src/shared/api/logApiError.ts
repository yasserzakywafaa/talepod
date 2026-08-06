import axios from "axios";

import { logger } from "src/shared/logger";

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
    logger.warn(
      `${label}: rate limited (429). Wait a moment or restart the API server.`,
    );
    return;
  }

  // A 4xx is the server rejecting the request as asked — expected, and noisy
  // in a crash reporter. Only 5xx and transport failures are worth reporting.
  const status = axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0;
  const isClientError = status >= 400 && status < 500;

  if (isClientError) {
    logger.warn(label, {
      status,
      url: axios.isAxiosError(error) ? error.config?.url : undefined,
    });
    return;
  }

  logger.error(label, error);
};
