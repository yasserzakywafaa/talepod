import { DEFAULT_FALLBACK_LANG } from "@yasserzakywafaa/client-core";
import type { SupportedLang } from "@yasserzakywafaa/client-core";

import type { User } from "src/shared/types/user";
import { getStoredLanguage } from "src/shared/storage/preferencesStorage";
import i18n from "src/i18n/init";

const SUPPORTED: SupportedLang[] = ["en", "ar", "de", "fr"];

const isSupported = (value: string | null | undefined): value is SupportedLang =>
  !!value && SUPPORTED.includes(value as SupportedLang);

/**
 * Mobile language resolution: AsyncStorage (explicit choice in Settings) first,
 * then server user preference, then fallback. Web client-core uses localStorage
 * and is not available in React Native.
 */
export const resolveAppLanguage = async (
  user?: User | null,
): Promise<SupportedLang> => {
  const stored = await getStoredLanguage();
  if (isSupported(stored)) {
    return stored;
  }

  const fromUser = user?.preferences?.languagePreference;
  if (isSupported(fromUser)) {
    return fromUser;
  }

  return DEFAULT_FALLBACK_LANG;
};

export const syncI18nWithAppLanguage = async (
  user?: User | null,
): Promise<void> => {
  const lang = await resolveAppLanguage(user);
  await i18n.changeLanguage(lang);
};
