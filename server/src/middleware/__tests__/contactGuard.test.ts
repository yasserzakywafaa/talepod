import { createMemoryRateLimitStore } from "@yasserzakywafaa/server-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createContactGuard } from "../contactGuard";

const fields = { name: "Ada", email: "ada@example.com", subject: "Hi", message: "Hello there" };
let ip = 0;

/** Runs the middleware once; resolves with the status it answered, or "next" when it let the request through. */
const run = (handler: ReturnType<typeof createContactGuard>, body: unknown, from = `10.0.0.${++ip}`) =>
  new Promise<number | "next">((resolve) => {
    const res = {
      status: vi.fn((code: number) => {
        resolve(code);
        return res;
      }),
      setHeader: vi.fn(),
      json: vi.fn(() => res),
    };
    const req = { headers: { "x-forwarded-for": from, "content-length": "100" }, socket: {}, body };
    handler(req as never, res as never, () => resolve("next"));
  });

const cloudflare = (reply: Record<string, unknown>) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify(reply)));

const guard = (overrides = {}) =>
  createContactGuard({ getDb: () => ({}) as never, store: createMemoryRateLimitStore(), secretKey: "s", isProd: true, max: 2, ...overrides });

afterEach(() => vi.restoreAllMocks());

describe("contact guard", () => {
  it("lets a verified message through", async () => {
    cloudflare({ success: true, hostname: "www.talepod.com", action: "contact" });
    expect(await run(guard(), { ...fields, turnstileToken: "tok" })).toBe("next");
  });

  it("blocks a missing or rejected token, and tokens from other sites", async () => {
    cloudflare({ success: false, "error-codes": ["invalid-input-response"] });
    expect(await run(guard(), fields)).toBe(403);
    expect(await run(guard(), { ...fields, turnstileToken: "bad" })).toBe(403);
    cloudflare({ success: true, hostname: "evil.example", action: "contact" });
    expect(await run(guard(), { ...fields, turnstileToken: "tok" })).toBe(403);
  });

  it("answers a filled honeypot with a fake success without calling Cloudflare", async () => {
    const fetchSpy = cloudflare({ success: true });
    expect(await run(guard(), { ...fields, turnstileToken: "tok", website: "http://spam" })).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rate limits per IP", async () => {
    cloudflare({ success: true, hostname: "talepod.com", action: "contact" });
    const handler = guard();
    const body = { ...fields, turnstileToken: "tok" };
    expect(await run(handler, body, "9.9.9.9")).toBe("next");
    expect(await run(handler, body, "9.9.9.9")).toBe("next");
    expect(await run(handler, body, "9.9.9.9")).toBe(429);
  });

  it("refuses in production without a secret, skips Turnstile elsewhere", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await run(guard({ secretKey: "" }), fields)).toBe(503);
    expect(await run(guard({ secretKey: "", isProd: false }), fields)).toBe("next");
  });
});
