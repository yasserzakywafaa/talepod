/**
 * Release bundles keep `console.*`, which is how auth codes end up readable
 * in device logs. `debug`/`info` no-op outside development.
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

  // Pass the original error so the reporter gets a real stack.
  error: (message: string, error?: unknown): void => {
    if (isDev) {
      console.error(message, error ?? "");
    }
    addBreadcrumb({ level: "error", message, data: error });
    captureException(error, { message });
  },
};

export default logger;
