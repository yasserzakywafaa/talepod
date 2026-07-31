/**
 * Lightweight censored-word check for mobile.
 *
 * Deliberately a static English list rather than the web's per-language word
 * files — those were ported over unused and have been removed. If mobile ever
 * needs the full multi-language check, take it from `web/` rather than
 * re-adding dead copies here.
 */
const BLOCKED = new Set(
  [
    "fuck",
    "shit",
    "asshole",
    "bitch",
    "damn",
    "crap",
    "piss",
    "dick",
    "cock",
    "pussy",
    "slut",
    "whore",
    "nigger",
    "faggot",
    "retard",
  ].map((w) => w.toLowerCase()),
);

export const hasCensoredWords = (text: string): boolean => {
  if (!text?.trim()) return false;
  const tokens = text.toLowerCase().split(/\W+/);
  return tokens.some((t) => BLOCKED.has(t));
};
