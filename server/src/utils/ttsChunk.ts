/**
 * Splits long narration text into chunks small enough for a single TTS request.
 *
 * TTS endpoints cap their input — `tts-1`/`tts-1-hd` at 4,096 characters and
 * `gpt-4o-mini-tts` at ~2,000 input tokens. A single full-length story easily
 * exceeds that (which silently truncated long narrations before). We break on
 * sentence boundaries first (incl. Arabic punctuation), then word boundaries,
 * then a hard char-split as a last resort. Because chunks break at natural
 * pauses, the resulting MP3 segments concatenate seamlessly.
 *
 * The default budget (2,000 chars) is conservative across all 11 supported
 * languages — comfortably under the token cap even for token-dense scripts.
 */
export const chunkTextForTts = (text: string, maxChars = 2000): string[] => {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  // Sentence-ish units, keeping the trailing punctuation (Latin + Arabic).
  const sentences = clean
    .split(/(?<=[.!?…؟۔])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };

  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      // A single oversized sentence (rare): flush, then split by words/chars.
      flush();
      chunks.push(...splitOversized(sentence, maxChars));
      continue;
    }
    if (!current) {
      current = sentence;
    } else if (current.length + 1 + sentence.length <= maxChars) {
      current += " " + sentence;
    } else {
      flush();
      current = sentence;
    }
  }
  flush();
  return chunks;
};

/** Splits a single over-long sentence on word boundaries (chars as a fallback). */
const splitOversized = (text: string, maxChars: number): string[] => {
  const out: string[] = [];
  let current = "";

  for (const word of text.split(/\s+/)) {
    if (word.length > maxChars) {
      if (current.trim()) {
        out.push(current.trim());
        current = "";
      }
      for (let i = 0; i < word.length; i += maxChars) {
        out.push(word.slice(i, i + maxChars));
      }
      continue;
    }
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word;
    } else {
      out.push(current.trim());
      current = word;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
};
