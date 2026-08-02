/**
 * Sentry behind a wrapper: its native module is absent in Expo Go, reporting
 * must never crash the app, and PII gets scrubbed in one place.
 */
import Constants from "expo-constants";

type Breadcrumb = {
  level: "info" | "warning" | "error";
  message: string;
  data?: unknown;
};

type SentryModule = typeof import("@sentry/react-native");

let sentry: SentryModule | null = null;
let initialised = false;

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

// Expo Go can't load native modules outside its own binary.
const isExpoGo = Constants.appOwnership === "expo";

const loadSentry = (): SentryModule | null => {
  if (sentry) return sentry;
  if (isExpoGo || !dsn) return null;

  try {
    // Lazy: a static import would run the native binding at module load,
    // before we can decide it is unsafe.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sentry = require("@sentry/react-native") as SentryModule;
    return sentry;
  } catch {
    return null;
  }
};

/** Values that must never leave the device, matched case-insensitively. */
const REDACTED_KEYS = [
  "accesstoken",
  "refreshtoken",
  "token",
  "password",
  "code",
  "otp",
  "authorization",
  "email",
  "phone",
  "phonenumber",
];

const isRedactedKey = (key: string): boolean => {
  const normalised = key.toLowerCase();
  return REDACTED_KEYS.some((redacted) => normalised.includes(redacted));
};

// Depth-limited so a cyclic or deep object can't hang the reporter.
const scrub = (value: unknown, depth = 0): unknown => {
  if (depth > 4) return "[truncated]";
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((entry) => scrub(entry, depth + 1));
  }

  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = isRedactedKey(key) ? "[redacted]" : scrub(entry, depth + 1);
    }
    return result;
  }

  return value;
};

// Safe with no DSN configured: the app just runs without reporting.
export const initMonitoring = (): void => {
  if (initialised) return;
  initialised = true;

  const client = loadSentry();
  if (!client) return;

  try {
    client.init({
      dsn,
      environment: process.env.EXPO_PUBLIC_ENV ?? "development",
      // Ties a crash report to the exact OTA update that produced it, not
      // just to the store build — the two drift apart with EAS Update.
      release: Constants.expoConfig?.version,
      dist: Constants.expoConfig?.runtimeVersion?.toString(),
      // Errors are always sent; traces are sampled because performance data
      // is high-volume and far less valuable than the crash itself.
      tracesSampleRate: 0.2,
      // We attach our own scrubbed context; the default request/user payload
      // would re-introduce the PII the scrubber exists to remove.
      sendDefaultPii: false,
      beforeSend: (event) => {
        if (event.extra) {
          event.extra = scrub(event.extra) as Record<string, unknown>;
        }
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map((crumb) => ({
            ...crumb,
            data: scrub(crumb.data) as Record<string, unknown>,
          }));
        }
        return event;
      },
    });
  } catch {
    sentry = null;
  }
};

export const addBreadcrumb = ({ level, message, data }: Breadcrumb): void => {
  const client = loadSentry();
  if (!client) return;

  try {
    client.addBreadcrumb({
      level,
      message,
      data: scrub(data) as Record<string, unknown> | undefined,
    });
  } catch {
    // Reporting must never break the caller.
  }
};

export const captureException = (
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  const client = loadSentry();
  if (!client) return;

  try {
    const thrown = error instanceof Error ? error : new Error(String(error));
    client.captureException(thrown, {
      extra: scrub(context) as Record<string, unknown> | undefined,
    });
  } catch {
    // Reporting must never break the caller.
  }
};

// Only the opaque id is sent, never email or phone — hence not a `User`.
export const setMonitoringUser = (userId: string | null): void => {
  const client = loadSentry();
  if (!client) return;

  try {
    client.setUser(userId ? { id: userId } : null);
  } catch {
    // Reporting must never break the caller.
  }
};
