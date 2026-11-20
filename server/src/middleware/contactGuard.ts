import {
  createFormGuard,
  createMongoRateLimitStore,
  createRateLimiter,
  createTurnstileVerifier,
  getClientIp,
  type RateLimitStore,
} from "@yasserzakywafaa/server-core";
import type { Db } from "mongodb";
import type { RequestHandler } from "express";

import CONFIG from "../config";

/** Largest contact request body we accept. */
export const CONTACT_MAX_BODY_BYTES = 32 * 1024;
const DAY_MS = 24 * 60 * 60_000;
/** Give up on the rate-limit database quickly; the guard then allows and Turnstile still runs. */
const DB_TIMEOUT_MS = 3000;

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms);
    promise.then(
      (value) => (clearTimeout(timer), resolve(value)),
      (error) => (clearTimeout(timer), reject(error)),
    );
  });

/** Hosts a Turnstile token may come from: the site, its www/apex twin and dev. */
const SITE_HOSTS = ["talepod.com", "www.talepod.com", "dev.talepod.com"];

const allowedHostnames = (): string[] => {
  const hosts = new Set<string>(SITE_HOSTS);
  try {
    hosts.add(new URL(CONFIG.APP_URL).hostname);
  } catch {
    // Ignore a malformed APP_URL.
  }
  return [...hosts];
};

export interface ContactGuardOptions {
  getDb: () => Db | Promise<Db>;
  secretKey?: string;
  /** Production refuses contact messages without a secret; elsewhere Turnstile is skipped. */
  isProd?: boolean;
  /** Local runs use Cloudflare test keys, which answer with a dummy host and action. */
  isLocal?: boolean;
  max?: number;
  windowMs?: number;
  /** Tests: swap MongoDB for memory. */
  store?: RateLimitStore;
}

/** Error body; `message` too, because the web app's error toast reads it. */
const errorBody = (message: string, code: string) => ({ error: message, message, code });

/**
 * Anti-spam for POST /contact-support, from server-core: body size cap →
 * honeypot + 2 s time trap → per-IP limits in MongoDB → Cloudflare Turnstile.
 * A failed check answers here and never calls `next`, so nothing is emailed.
 */
export const createContactGuard = (options: ContactGuardOptions): RequestHandler => {
  const { secretKey, isProd = false, isLocal = false, max = 5, windowMs = 10 * 60_000 } = options;

  if (!secretKey && isProd) {
    console.error("[contact-support] TURNSTILE_SECRET_KEY is not set; refusing contact messages.");
    return (_req, res) => {
      res.status(503).json(errorBody("Contact form is temporarily unavailable", "verification-unavailable"));
    };
  }
  if (!secretKey) console.warn("[contact-support] TURNSTILE_SECRET_KEY not set; Turnstile skipped (non-production only).");

  const mongoStore = options.store ?? createMongoRateLimitStore({ getDb: options.getDb, collectionName: "contactRateLimits" });
  // Cap the whole hit: an unreachable database must not hold the request.
  const store: RateLimitStore = {
    hit: (key, ms, now) => withTimeout(mongoStore.hit(key, ms, now), DB_TIMEOUT_MS),
  };

  const guard = createFormGuard({
    maxBodyBytes: CONTACT_MAX_BODY_BYTES,
    honeypot: { minFillMs: 2000 },
    rateLimits: [
      { limiter: createRateLimiter({ store, prefix: "contact:short:", windowMs, max }) },
      { limiter: createRateLimiter({ store, prefix: "contact:day:", windowMs: DAY_MS, max: max * 4 }) },
    ],
    // Database down: let the request through to Turnstile rather than lose messages.
    onStoreError: "allow",
    turnstile: secretKey
      ? {
          verify: createTurnstileVerifier({
            secretKey,
            ...(isLocal ? {} : { expectedAction: "contact", expectedHostnames: allowedHostnames() }),
          }),
        }
      : undefined,
  });

  return (req, res, next) => {
    // Content-Length is missing on chunked requests, so also measure the parsed body.
    const declared = Number(req.headers["content-length"]);
    const parsed = Buffer.byteLength(JSON.stringify(req.body ?? {}));
    const bodyBytes = Math.max(Number.isFinite(declared) ? declared : 0, parsed);

    guard({ body: req.body, bodyBytes, ip: getClientIp(req.headers, req.socket?.remoteAddress) })
      .then((result) => {
        if (result.ok) return next();
        if (!result.silent) console.warn("[contact-support] blocked", result.code, result.details ?? "");
        if (result.retryAfterSeconds) res.setHeader("Retry-After", String(result.retryAfterSeconds));
        res.status(result.status).json(result.silent ? { success: true } : errorBody(result.message, result.code));
      })
      .catch(next);
  };
};
