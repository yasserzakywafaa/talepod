/**
 * Story content languages (slug locales in generated stories).
 * Site UI routing uses client-core DEFAULT_LOCALE_CONFIG (en, de, fr, ar).
 */
export interface Language {
  name: string;
  value: SupportedLanguages;
}

export enum SupportedLanguages {
  en = "en",
  ar = "ar",
  es = "es",
  fr = "fr",
  de = "de",
  pt = "pt",
  it = "it",
  ja = "ja",
  ko = "ko",
  ru = "ru",
  hi = "hi",
  zh_Hans = "zh-Hans",
}

export const Languages: Language[] = [
  { name: "English", value: SupportedLanguages.en },
  { name: "Arabic", value: SupportedLanguages.ar },
  { name: "Spanish", value: SupportedLanguages.es },
  { name: "French", value: SupportedLanguages.fr },
  { name: "German", value: SupportedLanguages.de },
  { name: "Portuguese", value: SupportedLanguages.pt },
  { name: "Italian", value: SupportedLanguages.it },
  { name: "Japanese", value: SupportedLanguages.ja },
  { name: "Korean", value: SupportedLanguages.ko },
  { name: "Russian", value: SupportedLanguages.ru },
  { name: "Hindi", value: SupportedLanguages.hi },
  { name: "Chinese (Simplified)", value: SupportedLanguages.zh_Hans },
];
