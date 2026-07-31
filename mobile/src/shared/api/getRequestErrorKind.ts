import axios from "axios";

/**
 * What went wrong, in terms a person can act on.
 *
 * Raw Axios text ("AxiosError: Network Error") tells a reader nothing and
 * leaks internals, so nothing user-facing should ever render it. Everything
 * shown on screen comes from these three cases instead.
 */
export type RequestErrorKind =
  /** The request never reached us — no connection, or the API is down. */
  | "offline"
  /** We reached the server and it failed (5xx, or a timeout mid-request). */
  | "server"
  /** Anything else, including a bad response we could not classify. */
  | "unknown";

export const getRequestErrorKind = (error: unknown): RequestErrorKind => {
  if (!axios.isAxiosError(error)) {
    return "unknown";
  }

  const status = error.response?.status;

  if (status === undefined) {
    // No response at all: DNS failure, refused connection, aeroplane mode,
    // or a request that timed out before the server answered.
    return "offline";
  }

  if (status >= 500) {
    return "server";
  }

  return "unknown";
};

/**
 * True when a failure is worth showing a whole error screen for.
 *
 * A 401 or a 404 is the caller's problem to handle; only a dead connection or
 * a broken server means "nothing here will work, try again later".
 */
export const isServiceUnavailable = (error: unknown): boolean => {
  const kind = getRequestErrorKind(error);
  return kind === "offline" || kind === "server";
};
