/** Lightweight censored-word check for mobile (static EN list subset). */
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
