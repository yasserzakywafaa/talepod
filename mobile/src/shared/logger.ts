/**
 * Development-only logging.
 *
 * React Native does **not** strip `console.*` from release bundles. Anything
 * logged with a bare `console.log` is readable on a real device (Console.app
 * on iOS, `adb logcat` on Android), which is how auth codes, user ids and
 * email addresses end up in device logs on a shipped build.
 *
 * `logger.debug`/`logger.info` compile away to a no-op outside development.
 * `logger.warn`/`logger.error` always run — those are real failures, and in
 * production they are also forwarded to the crash reporter as breadcrumbs so
 * a crash report carries the events that led up to it.
 */
import { addBreadcrumb, captureException } from "src/shared/monitoring";

const isDev = __DEV__;

export const logger = {
  debug: (message: string, context?: unknown): void => {
    if (!isDev) return;
    console.log(message, context ?? "");
  },

  info: (message: string, context?: unknown): void => {
    if (!isDev) return;
    console.log(message, context ?? "");
  },

  warn: (message: string, context?: unknown): void => {
    if (isDev) {
      console.warn(message, context ?? "");
    }
    addBreadcrumb({ level: "warning", message, data: context });
  },

  /**
   * Logs and reports. Pass the original error as `error` so the crash
   * reporter gets a real stack rather than a stringified message.
   */
  error: (message: string, error?: unknown): void => {
    if (isDev) {
      console.error(message, error ?? "");
    }
    addBreadcrumb({ level: "error", message, data: error });
    captureException(error, { message });
  },
};

export default logger;
