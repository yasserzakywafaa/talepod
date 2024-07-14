import censored_words_ar from "./features/censored_words_ar";
import censored_words_de from "./features/censored_words_de";
import censored_words_en from "./features/censored_words_en";
import censored_words_es from "./features/censored_words_es";
import censored_words_fr from "./features/censored_words_fr";
import censored_words_hi from "./features/censored_words_hi";
import censored_words_it from "./features/censored_words_it";
import censored_words_ja from "./features/censored_words_ja";
import censored_words_ko from "./features/censored_words_ko";
import censored_words_pt from "./features/censored_words_pt";
import censored_words_ru from "./features/censored_words_ru";
import censored_words_zh from "./features/censored_words_zh";

export const getAllCensoredWords = () => {
  return [
    censored_words_en,
    censored_words_ar,
    censored_words_es,
    censored_words_fr,
    censored_words_de,
    censored_words_zh,
    censored_words_ja,
    censored_words_ko,
    censored_words_ru,
    censored_words_pt,
    censored_words_it,
    censored_words_hi,
  ];
};

export const hasCensoredWords = (text: string): boolean => {
  if (!text || !text.trim().length) return false;

  const targetWord = text.toLowerCase().trim();
  const allCensoredWords = getAllCensoredWords();

  for (const censoredWordSet of allCensoredWords) {
    for (const censoredWord of censoredWordSet) {
      if (targetWord.includes(censoredWord)) {
        return true;
      }
    }
  }

  return false;
};
