import { createMemoryRateLimitStore } from "@yasserzakywafaa/server-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createContactGuard } from "../contactGuard";

const SITE = "talepod.com";
const fields = { name: "Ada", email: "ada@example.com", subject: "Hi", message: "Hello there" };
let ip = 0;

/** Runs the middleware to completion; returns the status it answered (if any), the JSON body and the `next` spy. */
const run = async (
  handler: ReturnType<typeof createContactGuard>,
  body: unknown,
  { from = `10.0.0.${++ip}`, headers = { "content-length": "100" } as Record<string, string> } = {},
) => {
  const next = vi.fn();
  let status: number | undefined;
  let json: unknown;
  const res = {
    status: vi.fn((code: number) => ((status = code), res)),
    setHeader: vi.fn(),
    json: vi.fn((value: unknown) => ((json = value), res)),
  };
  const req = { headers: { "x-forwarded-for": from, ...headers }, socket: {}, body };
  // Completion: a JSON response was sent, or next() was called.
  await new Promise<void>((resolve) => {
    res.json.mockImplementation((value: unknown) => ((json = value), resolve(), res));
    next.mockImplementation(() => resolve());
    handler(req as never, res as never, next);
  });
  // Let any late call land, so a response followed by next() is caught.
  await new Promise((resolve) => setTimeout(resolve, 20));
  return { status, json, next };
};

const passed = (r: Awaited<ReturnType<typeof run>>) => {
  expect(r.status).toBeUndefined();
  expect(r.json).toBeUndefined();
  expect(r.next).toHaveBeenCalledTimes(1);
  expect(r.next).toHaveBeenCalledWith();
};

const blocked = (r: Awaited<ReturnType<typeof run>>, status: number) => {
  expect(r.status).toBe(status);
  expect(r.json).toBeDefined();
  expect(r.next).not.toHaveBeenCalled();
};

const cloudflare = (reply: Record<string, unknown>) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify(reply)));

const guard = (overrides = {}) =>
  createContactGuard({ getDb: () => ({}) as never, store: createMemoryRateLimitStore(), secretKey: "s", isProd: true, max: 2, ...overrides });

afterEach(() => vi.restoreAllMocks());

describe("contact guard", () => {
  it("lets a verified message through exactly once", async () => {
    cloudflare({ success: true, hostname: SITE, action: "contact" });
    passed(await run(guard(), { ...fields, turnstileToken: "tok" }));
  });

  it("blocks missing, rejected and foreign tokens without calling next", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    cloudflare({ success: false, "error-codes": ["invalid-input-response"] });
    blocked(await run(guard(), fields), 403);
    const rejected = await run(guard(), { ...fields, turnstileToken: "bad" });
    blocked(rejected, 403);
    expect(rejected.json).toMatchObject({ code: "verification-failed", message: expect.any(String) });
    for (const hostname of ["evil.example", "localhost"]) {
      cloudflare({ success: true, hostname, action: "contact" });
      blocked(await run(guard(), { ...fields, turnstileToken: "tok" }), 403);
    }
  });

  it("answers a filled honeypot with a fake success, without Cloudflare or next", async () => {
    const fetchSpy = cloudflare({ success: true });
    const r = await run(guard(), { ...fields, turnstileToken: "tok", website: "http://spam" });
    blocked(r, 200);
    expect(r.json).toEqual({ success: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rate limits per IP", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    cloudflare({ success: true, hostname: SITE, action: "contact" });
    const handler = guard();
    const body = { ...fields, turnstileToken: "tok" };
    passed(await run(handler, body, { from: "9.9.9.9" }));
    passed(await run(handler, body, { from: "9.9.9.9" }));
    blocked(await run(handler, body, { from: "9.9.9.9" }), 429);
  });

  it("rejects large bodies, and measures bodies without a Content-Length", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchSpy = cloudflare({ success: true, hostname: SITE, action: "contact" });
    const body = { ...fields, turnstileToken: "tok" };
    blocked(await run(guard(), { ...body, message: "x".repeat(40_000) }), 413);
    blocked(await run(guard(), body, { headers: { "content-length": "40000" } }), 413);
    // No Content-Length (chunked): the parsed body is measured instead.
    blocked(await run(guard(), { ...body, message: "x".repeat(40_000) }, { headers: {} }), 413);
    expect(fetchSpy).not.toHaveBeenCalled();
    passed(await run(guard(), body, { headers: {} }));
  });

  it("refuses in production without a secret, skips Turnstile elsewhere", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const refused = await run(guard({ secretKey: "" }), fields);
    blocked(refused, 503);
    expect(refused.json).toMatchObject({ message: expect.any(String) });
    passed(await run(guard({ secretKey: "", isProd: false }), fields));
  });
});
