/**
 * Marketing copy lives in `page.json` as arrays and objects (steps, features,
 * testimonials …). The app has no typed i18n resources, so `t()` is declared
 * as returning a string even with `returnObjects`; these helpers do the cast
 * in one place and fall back to empty content when a key is missing.
 */

export const asList = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const asObject = <T>(value: unknown, fallback: T): T =>
  value && typeof value === "object" ? (value as T) : fallback;
